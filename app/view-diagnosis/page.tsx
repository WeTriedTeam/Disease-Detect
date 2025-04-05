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
import {
     Pagination,
     PaginationContent,
     PaginationEllipsis,
     PaginationItem,
     PaginationLink,
     PaginationNext,
     PaginationPrevious,
   } from "@/components/ui/pagination"
import Link from "next/link";
import { fetchAllRecords } from "../api/diagnosis/route";
import { useEffect,useState } from "react";
import { useSearchParams } from "next/navigation";
import Loading from "@/components/Loading";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
   } from "@/components/ui/select"
import { Diagnosis } from "../interface/Diagnosis";



interface PaginationResponse {
     records: any[];
     total_pages: number;
     current_page: number;
}

interface SortConfig {
     key: string;
     direction: 'asc' | 'desc' | null;
 }



export default function ViewDiagnosis(){

     const [diagnosisRecords, setDiagnosisRecords] = useState([]);
     const searchParams = useSearchParams();
     const page = searchParams.get('page') || "1";  // Default to page 1 if not provided
     const per_page = searchParams.get('per_page') || "10"; // Default to 10 records per page if not provided

     
     // Update the state to include pagination info
     const [paginationData, setPaginationData] = useState<PaginationResponse>({
          records: [],
          total_pages: 0,
          current_page: 1
     });

     const [sortConfig, setSortConfig] = useState<SortConfig>({
          key: '',
          direction: null
      });
  
     const perPageOptions = [5, 10, 25, 50];
    
    useEffect(() => {
     const fetchRecords = async () => {
          const records = await fetchAllRecords();
          paginationData.records = records;
          paginationData.total_pages = Math.ceil(records.length / parseInt(per_page));
          paginationData.current_page = parseInt(page);
     }

     fetchRecords();
    },[])


    useEffect(() => {
          if(page && per_page){
               fetch(`http://127.0.0.1:8000/diagnosis?page=${page}&per_page=${per_page}`)
               .then((res) => res.json())
               .then((data) => {
                    setDiagnosisRecords(data);
               })
               .catch((error) => {
                    console.error("Error fetching diagnosis records:", error);
               });
          }
    },[page, per_page])

    const currentPage = parseInt(page);
    const totalPages = paginationData.total_pages;

    const getPageNumbers = () => {
        let pages = [];
        if (totalPages <= 5) {
            // Show all pages if total pages are 5 or less
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show current page, 2 pages before and after when possible
            if (currentPage <= 3) {
                pages = [1, 2, 3, 4, 5];
            } else if (currentPage >= totalPages - 2) {
                pages = Array.from({length: 5}, (_, i) => totalPages - 4 + i);
            } else {
                pages = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
            }
        }
        return pages;
     }

     const handleSort = (key: string) => {
          let direction: 'asc' | 'desc' | null = 'asc';
    
          if (sortConfig.key === key) {
               if (sortConfig.direction === 'asc') direction = 'desc';
               else if (sortConfig.direction === 'desc') direction = null;
          }
          
          setSortConfig({ key, direction });
          
          // Update URL with sort parameters
          const params = new URLSearchParams(window.location.search);
          params.set('sort', key);
          params.set('order', direction || '');
          params.set('page', '1'); // Reset to first page when sorting
          window.history.pushState({}, '', `?${params.toString()}`);
     }
    

     return ( diagnosisRecords.length === 0 ? <Loading/> :
          <>
               <div className="flex justify-end mb-4">
               <Select
                    onValueChange={(value) => {
                         const params = new URLSearchParams(window.location.search);
                         params.set('per_page', value);
                         window.history.pushState({}, '', `?${params.toString()}`);
                         window.location.reload();
                    }}
                    defaultValue={per_page}
               >
                    <SelectTrigger className="w-[180px]">
                         <SelectValue placeholder="Select per page" />
                    </SelectTrigger>
                    <SelectContent>
                         {perPageOptions.map((option) => (
                              <SelectItem key={option} value={option.toString()}>{option}</SelectItem>
                         ))}
                    </SelectContent>
               </Select>
               </div>

               <Table>
               <TableCaption>A list of your recent diagnosis.</TableCaption>
               <TableHeader>
               <TableRow>
                    <TableHead className="w-[100px] cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('diagnosis_id')}
                    >Diagnosis ID
                    {sortConfig.key === 'diagnosis_id' && (
                              <span className="ml-5 mr-0"> {sortConfig.direction === 'asc' ? '↑' : sortConfig.direction === 'desc' ? '↓' : ''}</span>
                              )}
                    </TableHead>
                    <TableHead className="w-[100px] cursor-pointer hover:bg-gray-100"
                         onClick={() => handleSort('date')}
                    >Date
                         {sortConfig.key === 'date' && (
                              <span className="ml-5 mr-0"> {sortConfig.direction === 'asc' ? '↑' : sortConfig.direction === 'desc' ? '↓' : ''}</span>
                              )}
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-100"
                         onClick={() => handleSort('patient_name')}
                    >Patient Name
                    {sortConfig.key === 'patient_name' && (
                         <span className="ml-2">
                              {sortConfig.direction === 'asc' ? '↑' : sortConfig.direction === 'desc' ? '↓' : ''}
                         </span>
                    )}
                    </TableHead>
                    <TableHead>Diagnosis Note</TableHead>
                    <TableHead className="text-right">Detail</TableHead>
               </TableRow>
               </TableHeader>
               <TableBody>
                    {diagnosisRecords.map((item: {diagnosis_id: number, date: Date , patient_first_name: string, patient_last_name: string, doctor_note:string[], imgRef: string}) => 
                    (
                         <TableRow key={item.diagnosis_id}>
                              <TableCell className="font-medium">{item.diagnosis_id}</TableCell>
                              <TableCell className="font-medium">{`${new Date(item.date).toLocaleDateString()}`}</TableCell>
                              <TableCell>{item.patient_first_name + " " + item.patient_last_name}</TableCell>
                              <TableCell>
                                   {item.doctor_note?.map((note:string,index:number) => (
                                        <p key={index}>{note}</p>
                                   ))}
                              </TableCell>
                              <TableCell className="text-right"><Link href={`/view-diagnosis/${item.diagnosis_id}`}>Detail</Link></TableCell> {/* <Link href={`/view-diagnosis/${0}`}>Detail</Link>*/}
                         </TableRow>
                    ))}
               </TableBody>

               <Pagination>
               <PaginationContent>
                    <PaginationItem>
                         <PaginationPrevious 
                         href={currentPage > 1 ? `?page=${currentPage - 1}&per_page=${per_page}` : '#'}
                         aria-disabled={currentPage === 1}
                         className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                         />
                    </PaginationItem>

                    {getPageNumbers().map((pageNum) => (
                         <PaginationItem key={pageNum}>
                         <PaginationLink 
                              href={`?page=${pageNum}&per_page=${per_page}`}
                              isActive={pageNum === currentPage}
                         >
                              {pageNum}
                         </PaginationLink>
                         </PaginationItem>
                    ))}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                         <>
                         <PaginationItem>
                              <PaginationEllipsis />
                         </PaginationItem>
                         <PaginationItem>
                              <PaginationLink href={`?page=${totalPages}&per_page=${per_page}`}>
                                   {totalPages}
                              </PaginationLink>
                         </PaginationItem>
                         </>
                    )}

                    <PaginationItem>
                         <PaginationNext 
                         href={currentPage < totalPages ? `?page=${currentPage + 1}&per_page=${per_page}` : '#'}
                         aria-disabled={currentPage === totalPages}
                         className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                         />
                    </PaginationItem>
               </PaginationContent>
          </Pagination>
               </Table>

          </>
     );
}