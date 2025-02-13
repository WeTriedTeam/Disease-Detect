'use client';

import {
     Table,
     TableBody,
     TableCaption,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
   } from "@/components/ui/table"
import Link from "next/link";
import { fetchAllRecords } from "../api/diagnosis/route";
import { useEffect,useState } from "react";


export default function ViewDiagnosis(){

    const [diagnosisRecords, setDiagnosisRecords] = useState([]);
    
    useEffect(() => {
     const fetchRecords = async () => {
          const records = await fetchAllRecords();
          setDiagnosisRecords(records);
     }

     fetchRecords();
    },[])

     return ( diagnosisRecords.length === 0 ? <>Loading...</> :
          <>
               <Table>
               <TableCaption>A list of your recent diagnosis.</TableCaption>
               <TableHeader>
               <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Diagnosis Note</TableHead>
                    <TableHead className="text-right">Detail</TableHead>
               </TableRow>
               </TableHeader>
               <TableBody>
                    {diagnosisRecords.map((item: {diagnosis_id: number, date: string, patient_first_name: string, patient_last_name: string, diagnosisNote:string, imgRef: string}) => 
                    (
                         <TableRow key={item.diagnosis_id}>
                              <TableCell className="font-medium">{item.date}</TableCell>
                              <TableCell>{item.patient_first_name + " " + item.patient_last_name}</TableCell>
                              <TableCell>
                                   {item.diagnosisNote}
                              </TableCell>
                              <TableCell className="text-right"><Link href={`/view-diagnosis/${item.diagnosis_id}`}>Detail</Link></TableCell> {/* <Link href={`/view-diagnosis/${0}`}>Detail</Link>*/}
                         </TableRow>
                    ))}
               </TableBody>
               </Table>

          </>
     );
}