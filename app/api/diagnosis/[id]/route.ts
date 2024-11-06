import { NextResponse } from "next/server";


//   Fetch all records
async function fetchRecords(){
     // const res = await fetch('http://localhost:3000/api/diagnosis');
     // if(!res.ok){
     //      throw new Error('Failed to fetch records!');
     // }

     // return res.json();
}


//   Mock Data
const records = [     {id: "0", patientName: 'John Doe', diagnosisNote: 'Lung Problem', date:'15/10/2024', imgRef: '/ct_images/images/val/', filename: '1_jpg.rf.4a59a63d0a7339d280dd18ef3c2e675a'},
          {id: "1", patientName: 'Jane Doe', diagnosisNote: 'Lung Problem', date:'14/10/2024', imgRef: "/ct_images/images/val/", filename: '2_jpg.rf.b87583d95aa220d4b7b532ae1948e7b7'},
          {id: "2", patientName: 'Go Doe', diagnosisNote: 'Lung Problem', date:'13/10/2024', imgRef: "/ct_images/images/val/", filename: '3_jpg.rf.d2932cce7e88c2675e300ececf9f1b82'}];

//   GET /api/diagnosis/[id]
export async function GET(request: Request, { params }: { params: { id: string } }){
     const {id} = params;

     
     const record = records.find(record => record.id === id);

     if(!record){
          return NextResponse.json({error: 'Record not found!'});
     }

     return NextResponse.json(record);
     
}