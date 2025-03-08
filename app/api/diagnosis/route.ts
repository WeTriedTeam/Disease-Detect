import { NextResponse } from "next/server";



//   Get /api/diagnosis-records
export async function fetchAllRecords(){
     const res = await fetch('http://127.0.0.1:8000/view-diagnosis');

     if(res.ok){
          const data = await res.json();
          return data;
     }
 
}