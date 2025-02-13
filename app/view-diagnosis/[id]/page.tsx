'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState,useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog,DialogContent,DialogTitle,DialogTrigger,DialogDescription, DialogHeader, DialogFooter  } from "@/components/ui/dialog";
import AddNoduleSection from "@/components/AddNoduleSection";
import { BoundingBox } from "@/app/interface/BoundingBox";
import {fetchPatientDiagnosis} from "@/app/api/diagnosis/[id]/route";
import { Diagnosis } from "@/app/interface/Diagnosis";


export default function DiagnosisDetailPage(){

     const {id} = useParams(); // Access dynamic param 'id'

 
        
     const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
     const [editable, setEditable] = useState(false);
     const [diagnosisDetail, setDiagnosisDetail] = useState<Diagnosis>();
     const [isLoading, setIsLoading] = useState(true);


     //   Draw
     const [isDialogOpen, setIsDialogOpen] = useState(false);
    

     useEffect(() => {
          const loadDiagnosis = async () => {
               const diagnosisId = Array.isArray(id) ? id[0] : id;
               if(!diagnosisId){
                    throw new Error('Invalid Diagnosis ID');
               }

               const data = await fetchPatientDiagnosis({params: {id: diagnosisId}});
               setDiagnosisDetail(data);
               setIsLoading(false);
          }     

          loadDiagnosis();
     },[id]);



     // useEffect(() => {
     //      if (diagnosisDetail?.nodule_position) {
     //           const boxes = diagnosisDetail.nodule_position.map((nodule) => ({
     //               classId: nodule.classId,
     //               className: nodule.className,
     //               bbox: nodule.bbox,
     //               confidence: nodule.confidence,
     //               xCenter: nodule.bbox[0],
     //               yCenter: nodule.bbox[1],
     //               width: nodule.bbox[2],
     //               height: nodule.bbox[3]
     //           }));
               
     //           setBoundingBoxes(boxes.filter(box => 
     //               box.xCenter !== undefined && 
     //               box.yCenter !== undefined
     //           ));
     //       }                                                                                                             
     //  }, [diagnosisDetail]);



     //   Toggle Edit/Save
     const toggleEdit = () => {
          setEditable(!editable)
     }


     const addNodule = (newBoundingBox: BoundingBox) => {
          setBoundingBoxes(prevBoundingBoxes => [...prevBoundingBoxes, newBoundingBox]);
     }


     return (
          <div>
              { diagnosisDetail ? (<> 
                    <div className="flex flex-row">
                         <h1 className="text-lg font-semibold md:text-2xl basis-2/6">Diagnosis Detail No.{diagnosisDetail?.diagnosis_id} </h1> 
                         <div className="basis-3/6"></div> 
                         <Button className="basis-1/6 justify-self-end" onClick={toggleEdit}>{editable ? 'Save' : 'Edit' }</Button>
                    </div>
                    
                    <div
                         className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
                         >
                              <div className="mt-8 mb-8 grid grid-cols-2 grid-rows-2 gap-11 divide-x">

                                   <div style={{position: 'relative', display: 'inline-block'}} id="Diagnosis-Image">
                                        <img id="ct-img" style={{display: 'block', width:'100%'}} src={`${'http://127.0.0.1:8000/images/'+diagnosisDetail.photo_path.replace("uploads\\",'')}`} alt="CT Scan Image" />

                                        <svg style={{
                                             position: 'absolute',
                                             top:0,
                                             left:0,
                                             width: '100%',
                                             height: '100%',
                                             pointerEvents: 'none'
                                        }}
                                             viewBox={`0 0`}
                                             preserveAspectRatio="none"
                                        >
          
     
                                             {
                                                  boundingBoxes
                                                  .filter(box => box && box.xCenter !== undefined && box.yCenter !== undefined)
                                                  .map((box, index) => (
                                                       <rect 
                                                       key={index}
                                                       x={(box.xCenter - box.width / 2) * 416}
                                                       y={(box.yCenter - box.height / 2) * 416}
                                                       width={box.width * 416}
                                                       height={box.height * 416}
                                                       stroke="red"
                                                       strokeWidth="2"
                                                       fill="none"
                                                       />
                                                  ))
                                             }
                                        </svg>
                                   </div>                                   

                                   <Card>
                                        <CardHeader>
                                             <CardTitle>Diagnosis Detail</CardTitle>
                                        </CardHeader>

                                        <CardContent>
                                        <form>
                                             <div className="grid w-full items-center gap-4">
                                                  <div className="flex flex-col space-y-1.5">
                                                       <Label htmlFor="patientName">Patient Name</Label>
                                                       <Input readOnly id="patientName" value={`${diagnosisDetail.patient_first_name + " " + diagnosisDetail.patient_last_name}`}  />
                                                  </div>

                                                  <div className="flex flex-col space-y-1.5">
                                                       <Label htmlFor="dateOfDiagnosis">Date of Dianosis</Label>
                                                       <Input readOnly id="dateOfDiagnosis" value={`${diagnosisDetail.date}`}/>
                                                  </div>

                                                  {/* <div className="flex flex-col space-y-1.5">
                                                       <Label htmlFor="diagnosisNote">Diagnosis Note</Label>
                                                       <Input id="diagnosisNote" value={`${diagnosisDetail.diagnosisNote}`}/>
                                                  </div> */}

                                                  <div>
                                                       <h4>Nodules</h4>
                                                       <Dialog>
                                                            <DialogTrigger asChild><Button onClick={() => setIsDialogOpen(!isDialogOpen)} variant="outline">Add Nodule</Button></DialogTrigger>
                                                            <DialogContent>
                                                                 <DialogHeader>
                                                                      <DialogTitle>Add New Nodule</DialogTitle>
                                                                      <DialogDescription>
                                                                           Create a notation of abnormal lung nodule.
                                                                      </DialogDescription>
                                                                 </DialogHeader>
                                                                 <div>
                                                                      <AddNoduleSection addNodule={addNodule} diagnosisDetail={diagnosisDetail} />
                                                                 </div>
                                                            </DialogContent>
                                                        
                                                       </Dialog>
                                                  </div>
                                                  
                                                  <div>
                                                       <ScrollArea className="h-[250px] w-[50]">
                                                            {boundingBoxes
                                                            .filter(box => box && box.xCenter !== undefined && box.yCenter !== undefined)
                                                            .map((box,index) => (
                                                                 <Card className="mt-2 mb-2" key={index}>
                                                                      <CardHeader>Nodule {index}</CardHeader>
                                                                      <CardContent>
                                                                           <label htmlFor="">X:</label>
                                                                           <Input className="mb-2" value={`${(box.xCenter - box.width / 2) * 416}`}></Input>
                                                                           <label htmlFor="">Y:</label>
                                                                           <Input value={`${(box.yCenter - box.height / 2) * 416}`}></Input>
                                                                      </CardContent>
                                                                 </Card>
                                                            ))}
                                                       </ScrollArea>
                                                  </div>
                                             </div>
                                        </form>
                                        </CardContent>
                                   </Card>
                              </div>
                    </div>
               </>) : (<>Loading...</>)}
          </div>   
     );
}