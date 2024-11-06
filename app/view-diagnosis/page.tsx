

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
   
// Async fetch diagnosis records
async function fetchRecords(){
     const res = await fetch('http://localhost:3000/api/diagnosis', {
          cache:'no-store'
     })

     if(!res.ok){
          throw new Error('Failed to fetch records');
     }

     return res.json();
}



export default async function ViewDiagnosis(){

     const diagnosisRecords = await fetchRecords();
     

     return (
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
                    {diagnosisRecords?.map((item: {id: string, date: string, patientName: string, diagnosisNote:string, imgRef: string}) => 
                    (
                         <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.date}</TableCell>
                              <TableCell>{item.patientName}</TableCell>
                              <TableCell>
                                   {item.diagnosisNote}
                              </TableCell>
                              <TableCell className="text-right"><Link href={`/view-diagnosis/${item.id}`}>Detail</Link></TableCell> {/* <Link href={`/view-diagnosis/${0}`}>Detail</Link>*/}
                         </TableRow>
                    ))}
               </TableBody>
               </Table>

          </>
     );
}