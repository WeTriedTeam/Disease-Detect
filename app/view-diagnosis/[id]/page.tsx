'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState,useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog,DialogContent,DialogTitle,DialogTrigger,DialogDescription, DialogHeader, DialogFooter  } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BoundingBox } from "@/app/interface/BoundingBox";
import {fetchPatientDiagnosis} from "@/app/api/diagnosis/[id]/route";
import { Diagnosis } from "@/app/interface/Diagnosis";
import { Nodule } from "@/app/interface/Nodule";


const SEVERITY_COLORS = {
     mild: "#00FF00",     // Green
     moderate: "#FFA500", // Orange
     severe: "#FF0000",   // Red
     critical: "#800000"  // Dark Red
} as const;

type Severity = keyof typeof SEVERITY_COLORS;

export default function DiagnosisDetailPage(){

     const {id} = useParams(); // Access dynamic param 'id'

 
        
     const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
     const [editable, setEditable] = useState(false);
     const [diagnosisDetail, setDiagnosisDetail] = useState<Diagnosis>();
     const [isLoading, setIsLoading] = useState(true);


     //   Draw
     const [isDialogOpen, setIsDialogOpen] = useState(false);
     const imageRef = useRef<HTMLDivElement>(null);
     const [isDrawing, setIsDrawing] = useState(false);
     const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);

     //   Resizing Boxes
     const [isResizing, setIsResizing] = useState(false);
     const [resizeHandle, setResizeHandle] = useState<string | null>(null);
     const [resizingBoxIndex, setResizingBoxIndex] = useState<number | null>(null);

     //   Dragging Boxes
     const [isDragging, setIsDragging] = useState(false);
     const [draggingBoxIndex, setDraggingBoxIndex] = useState<number | null>(null);
     const [dragOffset, setDragOffset] = useState<{x: number, y: number} | null>(null);

    
      // Hovering the nodule
      const [hoveredNoduleIndex, setHoveredNoduleIndex] = useState<number | null>(null);

      // Open Accordian Item according to the nodule
      const [openAccordionItem, setOpenAccordionItem] = useState<string | undefined>(undefined);
 
      // Show save dialog (Before saving changes)
      const [showSaveDialog, setShowSaveDialog] = useState(false);


     useEffect(() => {
          const loadDiagnosis = async () => {
               try{
                    const diagnosisId = Array.isArray(id) ? id[0] : id;
                    if(!diagnosisId){
                         throw new Error('Invalid Diagnosis ID');
                    }

                    const data = await fetchPatientDiagnosis({params: {id: diagnosisId}});
                    setDiagnosisDetail(data);
                    setIsLoading(false);
                    
                    console.log(data.nodules);

                    if(data.nodules && Array.isArray(data.nodules)){
                         const boxes = data.nodules.map((nodule: Nodule) => {
                              const [xCenter, yCenter, width, height] = nodule.position;
                              return {
                                   xCenter,
                                   yCenter,
                                   width,
                                   height,
                                   classId: 0,
                                   className: "nodule",
                                   confidence: nodule.confidence,
                                   bbox: nodule.position,
                                   severity: "mild",
                                   isTemp:false,
                                   notes: ""
                              }
                         });
                         setBoundingBoxes(boxes);
                    }
               }
               catch(error){
                    console.error('Error:', error);
               }

          }     

          loadDiagnosis();
     },[id]);



     //   Handle box resize
     const handleResize = (event: React.MouseEvent, index: number, handle: string) => {
          if (!editable) return;
          event.stopPropagation();
          setIsResizing(true);
          setResizeHandle(handle);
          setResizingBoxIndex(index);
          setStartPoint(getMousePosition(event));
      };

     //   Handle box dragging
     const handleDragStart = (event: React.MouseEvent, index: number) => {
          if (!editable) return;
          event.stopPropagation();
          const box = boundingBoxes[index];
          const currentPoint = getMousePosition(event);
          
          setIsDragging(true);
          setDraggingBoxIndex(index);
          setDragOffset({
              x: currentPoint.x - box.xCenter,
              y: currentPoint.y - box.yCenter
          });
      };


     //   Toggle Edit/Save
     const toggleEdit = () => {
          if(editable){
               setShowSaveDialog(true);
          } else {
               setEditable(true);
          }
     }

     //   Mouse events for drawing bounding boxes
     //   Get mouse position relative to the image container
     const getMousePosition = (event: React.MouseEvent) => {
          if (!imageRef.current) return { x: 0, y: 0 };
          
          const rect = imageRef.current.getBoundingClientRect();
          // Calculate position relative to the image container
          const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
          const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
          
          return { x, y };
     };

     const handleMouseDown = (event: React.MouseEvent) => {
          if (!editable) return;
          event.preventDefault();
          const pos = getMousePosition(event);
          setIsDrawing(true);
          setStartPoint(pos);
     };

     const handleMouseMove = (event: React.MouseEvent) => {
          if (!editable) return;
          event.preventDefault();

          if (isDragging && draggingBoxIndex !== null && dragOffset) {
               const currentPoint = getMousePosition(event);
               const box = boundingBoxes[draggingBoxIndex];
               
               // Calculate new center position
               const newXCenter = Math.max(box.width/2, 
                   Math.min(1 - box.width/2, currentPoint.x - dragOffset.x));
               const newYCenter = Math.max(box.height/2, 
                   Math.min(1 - box.height/2, currentPoint.y - dragOffset.y));
       
               // Update box position using transform for better performance
               const updatedBox = {
                   ...box,
                   xCenter: newXCenter,
                   yCenter: newYCenter
               };
       
               setBoundingBoxes(prev => prev.map((b, i) => 
                   i === draggingBoxIndex ? updatedBox : b
               ));
           } else if (isResizing && resizingBoxIndex !== null && startPoint && resizeHandle) {
              const currentPoint = getMousePosition(event);
              const box = boundingBoxes[resizingBoxIndex];
              
              let newWidth = box.width;
              let newHeight = box.height;
              let newXCenter = box.xCenter;
              let newYCenter = box.yCenter;
      
              // Handle corner resizing
              if (resizeHandle.length === 2) {
                  const [vertical, horizontal] = resizeHandle.split('');
                  
                  // Horizontal resizing
                  if (horizontal === 'e') {
                      newWidth = Math.max(0.01, currentPoint.x - (box.xCenter - box.width/2));
                  } else if (horizontal === 'w') {
                      newWidth = Math.max(0.01, (box.xCenter + box.width/2) - currentPoint.x);
                      newXCenter = currentPoint.x + newWidth/2;
                  }
                  
                  // Vertical resizing
                  if (vertical === 'n') {
                      newHeight = Math.max(0.01, (box.yCenter + box.height/2) - currentPoint.y);
                      newYCenter = currentPoint.y + newHeight/2;
                  } else if (vertical === 's') {
                      newHeight = Math.max(0.01, currentPoint.y - (box.yCenter - box.height/2));
                  }
              } else {
                  // Original side handle logic
                  switch (resizeHandle) {
                      case 'e':
                          newWidth = Math.max(0.01, currentPoint.x - (box.xCenter - box.width/2));
                          break;
                      case 'w':
                          newWidth = Math.max(0.01, (box.xCenter + box.width/2) - currentPoint.x);
                          newXCenter = currentPoint.x + newWidth/2;
                          break;
                      case 'n':
                          newHeight = Math.max(0.01, (box.yCenter + box.height/2) - currentPoint.y);
                          newYCenter = currentPoint.y + newHeight/2;
                          break;
                      case 's':
                          newHeight = Math.max(0.01, currentPoint.y - (box.yCenter - box.height/2));
                          break;
                  }
              }
      
              const updatedBox = {
                  ...box,
                  xCenter: newXCenter,
                  yCenter: newYCenter,
                  width: newWidth,
                  height: newHeight,
                  bbox: [newXCenter, newYCenter, newWidth, newHeight]
              };
      
              setBoundingBoxes(prev => prev.map((b, i) => 
                  i === resizingBoxIndex ? updatedBox : b
              ));
          } else if (isDrawing && startPoint){
               if (!isDrawing || !startPoint || !editable) return;
               event.preventDefault();
               const currentPoint = getMousePosition(event);
               
               // Calculate dimensions from the start point
               const width = Math.abs(currentPoint.x - startPoint.x);
               const height = Math.abs(currentPoint.y - startPoint.y);
               
               // Calculate center point
               const xCenter = Math.min(currentPoint.x, startPoint.x) + (width / 2);
               const yCenter = Math.min(currentPoint.y, startPoint.y) + (height / 2);

               // Create a temporary box
               const tempBox: BoundingBox = {
                    xCenter,
                    yCenter,
                    width,
                    height,
                    classId: 0,
                    className: "nodule",
                    confidence: 1,
                    bbox: [xCenter, yCenter, width, height],
                    severity: 'mild',
                    isTemp: true,
                    notes: ""
               };

               setBoundingBoxes(prev => {
                    const boxes = [...prev];
                    if (boxes.length > 0 && boxes[boxes.length - 1].isTemp) {
                         // Replace the temporary box
                         boxes[boxes.length - 1] = tempBox;
                    } else {
                         // Add new temporary box
                         boxes.push(tempBox);
                    }
                    return boxes;
               });
          }
     };

     const handleMouseUp = () => {
          if (!editable) return;

          if(isDragging){
               setIsDragging(false);
               setDraggingBoxIndex(null);
               setDragOffset(null);
          }
          if(isResizing){
               setIsResizing(false);
               setResizeHandle(null);
               setResizingBoxIndex(null);
          }

          setIsDrawing(false);
          setStartPoint(null);
          
          // Convert the temporary boxes to permanent ones
          setBoundingBoxes(prev => {
               const boxes = [...prev];
               if (boxes.length > 0 && boxes[boxes.length - 1].isTemp) {
                    const lastBox = boxes[boxes.length - 1];
                    boxes[boxes.length - 1] = {
                         ...lastBox,
                         isTemp: false,
                         severity: 'mild' // Set default severity for new boxes
                    };
               }
               return boxes;
          });
     };

     const deleteBox = (index: number, event: React.MouseEvent) => {
          event.preventDefault(); // Prevent form submission
          event.stopPropagation(); // Stop event bubbling
          
          setBoundingBoxes(prevBoxes => 
               prevBoxes.filter((_, i) => i !== index)
          );
     };

      // Update box properties
      const updateBox = (index: number, updates: Partial<BoundingBox>) => {
          setBoundingBoxes(prev => 
               prev.map((box, i) => 
                    i === index ? { ...box, ...updates } : box
               )
          );
     };

     // Save confirmation handler
     const handleSaveConfirm = () => {
          
          // Save the changes to the database

          setEditable(false);
          setShowSaveDialog(false);
          try{
               fetch("http://127.0.0.1:8000/update-nodules",{
                    method:'PUT',
                    headers: {
                         'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                         diagnosis_id: diagnosisDetail?.diagnosis_id,
                         bounding_box_list: boundingBoxes.map(box => ({
                              classId: 0,
                              className: "nodule",
                              confidence: box.confidence,
                              xCenter: box.xCenter,
                              yCenter: box.yCenter,
                              width: box.width,
                              height: box.height,
                              isTemp: false,
                              severity: box.severity,
                              notes: box.notes
                         }))
                    })
               })
               .then(response => alert(response))


          }
          catch(error){
               console.error('Error:', error);
          }
          
     };

     return (
          <div>
              { diagnosisDetail ? (<> 
                    <div className="flex flex-row">
                         <h1 className="text-lg font-semibold md:text-2xl basis-2/6">Diagnosis Detail No.{diagnosisDetail?.diagnosis_id} </h1> 
                         <div className="basis-3/6"></div> 
                         <Button className="basis-1/6 justify-self-end" onClick={toggleEdit}>{editable ? 'Save Changes' : 'Edit' }</Button>
                    </div>
                    {/* <img id="ct-img" style={{display: 'block', width:'100%'}} src={`${'http://127.0.0.1:8000/images/'+diagnosisDetail.photo_path.replace("uploads\\",'')}`} alt="CT Scan Image" /> */}
                    <div
                         className="flex flex-1 items-center justify-center rounded-lg" x-chunk="dashboard-02-chunk-1"
                         >
                              <div className="mt-8 mb-8 grid grid-cols-2 gap-11">
                                   <div 
                                        ref={imageRef}
                                        style={{
                                             position: 'relative', 
                                             display: 'inline-block',
                                             width: '600px',
                                             height: '600px'
                                        }} 
                                        id="Diagnosis-Image"
                                        onMouseDown={handleMouseDown}
                                        onMouseMove={handleMouseMove}
                                        onMouseUp={handleMouseUp}
                                        onMouseLeave={handleMouseUp}
                                   >
                                        <img 
                                             style={{
                                                  display: 'block', 
                                                  width: '100%',
                                                  height: '100%',
                                                  objectFit: 'contain',
                                                  cursor: editable ? 'crosshair' : 'default'
                                             }} 
                                             // src={"1_jpg.rf.4a59a63d0a7339d280dd18ef3c2e675a.jpg" }
                                             src={`${'http://127.0.0.1:8000/images/'+diagnosisDetail.photo_path.replace("uploads\\",'')}`} // if image is stored in the server
                                             alt="CT Scan Image" 
                                        />
                                        <svg 
                                             style={{
                                                  position: 'absolute',
                                                  top: 0,
                                                  left: 0,
                                                  width: '100%',
                                                  height: '100%',
                                                  pointerEvents: 'none'
                                             }}
                                             viewBox="0 0 600 600"
                                             preserveAspectRatio="none"
                                        >
                                             {boundingBoxes
                                             .filter(box => box && box.xCenter !== undefined && box.yCenter !== undefined)
                                             .map((box, index) => (
                                                  <TooltipProvider key={index}>
                                                       <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                 <g 
                                                                      onMouseEnter={() => setHoveredNoduleIndex(index)}
                                                                      onMouseLeave={() => setHoveredNoduleIndex(null)}
                                                                      onClick={() => setOpenAccordionItem(`nodule-${index}`)}
                                                                      style={{ pointerEvents: 'all', cursor: 'pointer' }}
                                                                 >
                                                                      <rect 
                                                                           x={(box.xCenter - box.width / 2) * 600}
                                                                           y={(box.yCenter - box.height / 2) * 600}
                                                                           width={box.width * 600}
                                                                           height={box.height * 600}
                                                                           stroke={SEVERITY_COLORS[box.severity as Severity || 'mild']}
                                                                           strokeWidth={hoveredNoduleIndex === index ? "4" : "2"}
                                                                           fill={hoveredNoduleIndex === index ? `${SEVERITY_COLORS[box.severity as Severity || 'mild']}20` : "none"}
                                                                           style={{
                                                                                transition: isDragging ? 'none' : 'all 0.2s ease-out',
                                                                                cursor: editable ? 'move' : 'pointer',
                                                                                transform: `translate(0, 0)`, // Enable hardware acceleration
                                                                                willChange: isDragging ? 'transform' : 'auto', // Optimize for animations
                                                                                touchAction: 'none', // Prevent touch scrolling while dragging
                                                                           }}
                                                                           onMouseDown={(e) => handleDragStart(e, index)}
                                                                      />
                                                                           
                                                                      {editable && (
                                                                           <>
                                                                                {/* Corner handles */}
                                                                                {['nw', 'ne', 'sw', 'se'].map(corner => {
                                                                                     const [vertical, horizontal] = corner.split('');
                                                                                     const x = (box.xCenter + (horizontal === 'e' ? 1 : -1) * box.width/2) * 600;
                                                                                     const y = (box.yCenter + (vertical === 's' ? 1 : -1) * box.height/2) * 600;
                                                                                     
                                                                                     return (
                                                                                          <g key={corner}>
                                                                                               <circle
                                                                                               cx={x}
                                                                                               cy={y}
                                                                                               r="4"
                                                                                               fill="white"
                                                                                               stroke={SEVERITY_COLORS[box.severity as Severity || 'mild']}
                                                                                               strokeWidth="2"
                                                                                               style={{ 
                                                                                                    cursor: `${corner}-resize`,
                                                                                                    filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.2))',
                                                                                               }}
                                                                                               onMouseDown={(e) => handleResize(e, index, corner)}
                                                                                               />
                                                                                          </g>
                                                                                     );
                                                                                })}
                                                                                
                                                                                {/* Side handles */}
                                                                                {['n', 's', 'e', 'w'].map(side => {
                                                                                     let x = box.xCenter;
                                                                                     let y = box.yCenter;
                                                                                     
                                                                                     if (side === 'e') x += box.width/2;
                                                                                     if (side === 'w') x -= box.width/2;
                                                                                     if (side === 'n') y -= box.height/2;
                                                                                     if (side === 's') y += box.height/2;
                                                                                     
                                                                                     return (
                                                                                          <g key={side}>
                                                                                               <rect
                                                                                               x={x * 600 - 3}
                                                                                               y={y * 600 - 3}
                                                                                               width="6"
                                                                                               height="6"
                                                                                               fill="white"
                                                                                               stroke={SEVERITY_COLORS[box.severity as Severity || 'mild']}
                                                                                               strokeWidth="2"
                                                                                               style={{ 
                                                                                                    cursor: `${side === 'n' || side === 's' ? 'ns' : 'ew'}-resize`,
                                                                                                    filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.2))',
                                                                                               }}
                                                                                               onMouseDown={(e) => handleResize(e, index, side)}
                                                                                               />
                                                                                          </g>
                                                                                     );
                                                                                })}
                                                                           </>
                                                                           )}
                                                                 </g>
                                                            </TooltipTrigger>
                                                            <TooltipContent 
                                                                 side="right"
                                                                 className="max-w-[200px]"
                                                            >
                                                                 <div className="space-y-2">
                                                                      <div className="font-medium">Nodule {index + 1}</div>
                                                                      <div className="text-sm">
                                                                           <span 
                                                                                className="inline-block px-2 py-1 rounded text-xs"
                                                                                style={{ 
                                                                                     backgroundColor: SEVERITY_COLORS[box.severity as Severity || 'mild'] + '20',
                                                                                     color: SEVERITY_COLORS[box.severity as Severity || 'mild']
                                                                                }}
                                                                           >
                                                                                {box.severity || 'mild'} severity
                                                                           </span>
                                                                      </div>
                                                                      {box.notes && (
                                                                           <div className="text-sm text-muted-foreground">
                                                                                {box.notes}
                                                                           </div>
                                                                      )}
                                                                      <div className="text-xs text-muted-foreground">
                                                                           Size: {Math.round(box.width * 600)}x{Math.round(box.height * 600)}
                                                                      </div>
                                                                 </div>
                                                            </TooltipContent>
                                                       </Tooltip>
                                                  </TooltipProvider>
                                             ))}
                                        </svg>
                                   </div>

                                   <div className="w-[600px]">
                                        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200">
                                             <CardHeader>
                                                  <CardTitle>Diagnosis Detail</CardTitle>
                                             </CardHeader>

                                             <CardContent>
                                             <div className="grid w-full items-center gap-4">
                                               
                                                  <div className="space-y-2">
                                                       <div className="flex items-center justify-between">
                                                            <h4 className="text-sm font-medium">Nodules ({boundingBoxes.length})</h4>
                                                       </div>
                                                       
                                                       <Tabs defaultValue="list" className="w-full">
                                                            <TabsList className="grid w-full grid-cols-2">
                                                                 <TabsTrigger value="list">List View</TabsTrigger>
                                                                 <TabsTrigger value="summary">Summary</TabsTrigger>
                                                            </TabsList>

                                                            <TabsContent value="list" className="mt-2">
                                                                 <div className="h-[400px] overflow-hidden rounded-md border">
                                                                      <ScrollArea className="h-full">
                                                                           <div className="p-4">
                                                                                <Accordion 
                                                                                     type="single" 
                                                                                     collapsible 
                                                                                     className="space-y-2"
                                                                                     value={openAccordionItem}
                                                                                     onValueChange={setOpenAccordionItem}
                                                                                >
                                                                                     {boundingBoxes
                                                                                     .filter(box => box && box.xCenter !== undefined && box.yCenter !== undefined)
                                                                                     .map((box, index) => (
                                                                                          <AccordionItem 
                                                                                               value={`nodule-${index}`} 
                                                                                               key={index}
                                                                                               className={`
                                                                                                    border-l-4 transition-all
                                                                                                    ${hoveredNoduleIndex === index ? 'shadow-md scale-[1.02]' : 'hover:shadow-sm'}
                                                                                               `}
                                                                                               style={{ 
                                                                                                    borderLeftColor: SEVERITY_COLORS[box.severity as Severity || 'mild'],
                                                                                                    transform: hoveredNoduleIndex === index ? 'translateX(4px)' : 'none',
                                                                                                    transition: 'all 0.2s ease-in-out'
                                                                                               }}
                                                                                               onMouseEnter={() => setHoveredNoduleIndex(index)}
                                                                                               onMouseLeave={() => setHoveredNoduleIndex(null)}
                                                                                          >
                                                                                               
                                                                                                       
                                                                                                        <AccordionTrigger className="px-4 hover:no-underline">
                                                                                                             <div className="flex items-center justify-between w-full">
                                                                                                                  <div className="flex items-center gap-2">
                                                                                                                       <span className="font-semibold">Nodule {index + 1}</span>
                                                                                                                  </div>
                                                                                                                  <span 
                                                                                                                       className="text-sm px-2 py-1 rounded"
                                                                                                                       style={{ 
                                                                                                                            backgroundColor: SEVERITY_COLORS[box.severity as Severity || 'mild'] + '20',
                                                                                                                       }}
                                                                                                                  >
                                                                                                                       {box.severity || 'mild'}
                                                                                                                  </span>
                                                                                                             </div>
                                                                                                        </AccordionTrigger>
                                                                                         <AccordionContent className="px-4 pt-2">
                                                                                              <div className="space-y-4">
                                                                                                   {/* Severity selector */}
                                                                                                   <div>
                                                                                                        <Label className="text-sm font-medium mb-2 block">
                                                                                                             Severity Level
                                                                                                        </Label>
                                                                                                        <div className="flex gap-2">
                                                                                                             {Object.entries(SEVERITY_COLORS).map(([level, color]) => (
                                                                                                                  <button
                                                                                                                       key={level}
                                                                                                                       type="button"
                                                                                                                       onClick={() => editable && updateBox(index, { 
                                                                                                                            severity: level as Severity 
                                                                                                                       })}
                                                                                                                       className={`
                                                                                                                            flex-1 px-3 py-1.5 rounded
                                                                                                                            transition-all duration-200
                                                                                                                            ${box.severity === level ? 'ring-2 ring-offset-1' : 'opacity-50'}
                                                                                                                            ${!editable ? 'cursor-not-allowed' : 'hover:opacity-100'}
                                                                                                                       `}
                                                                                                                       style={{
                                                                                                                            backgroundColor: color + '20',
                                                                                                                            borderLeft: `3px solid ${color}`
                                                                                                                       }}
                                                                                                                       disabled={!editable}
                                                                                                                       title={`${level.charAt(0).toUpperCase() + level.slice(1)} Severity`}
                                                                                                                  >
                                                                                                                       <div className="text-xs font-medium">
                                                                                                                            {level.slice(0, 1).toUpperCase()}
                                                                                                                       </div>
                                                                                                                  </button>
                                                                                                             ))}
                                                                                                        </div>
                                                                                                   </div>

                                                                                                   {/* Notes */}
                                                                                                   <div>
                                                                                                        <Label className="text-sm font-medium">Notes</Label>
                                                                                                        <textarea
                                                                                                             className="w-full p-2 border rounded mt-1 min-h-[80px]"
                                                                                                             value={box.notes || ''}
                                                                                                             onChange={(e) => updateBox(index, { notes: e.target.value })}
                                                                                                             disabled={!editable}
                                                                                                             placeholder="Add clinical observations..."
                                                                                                        />
                                                                                                   </div>

                                                                                                   {/* Actions */}
                                                                                                   <div className="flex justify-between items-center pt-2">
                                                                                                        {editable && (
                                                                                                             <Button
                                                                                                                  variant="destructive"
                                                                                                                  size="sm"
                                                                                                                  onClick={(e) => deleteBox(index, e)}
                                                                                                                  type="button"
                                                                                                             >
                                                                                                                  Delete
                                                                                                             </Button>
                                                                                                        )}
                                                                                                   </div>
                                                                                              </div>
                                                                                         </AccordionContent>
                                                                                      </AccordionItem>
                                                                                 ))}
                                                                                </Accordion>
                                                                           </div>
                                                                      </ScrollArea>
                                                                 </div>
                                                              </TabsContent>

                                                              <TabsContent value="summary">
                                                                   <Card>
                                                                        <CardHeader>
                                                                             <CardTitle>Nodules Summary</CardTitle>
                                                                        </CardHeader>
                                                                        <CardContent>
                                                                             <div className="space-y-2">
                                                                                  <div className="grid grid-cols-2 gap-4">
                                                                                       <div>Total Nodules: {boundingBoxes.length}</div>
                                                                                       <div>
                                                                                            By Severity:
                                                                                            <ul className="list-inside list-disc">
                                                                                                 {Object.keys(SEVERITY_COLORS).map(severity => (
                                                                                                      <li key={severity}>
                                                                                                           {severity}: {
                                                                                                                boundingBoxes.filter(box => 
                                                                                                                     box.severity === severity
                                                                                                                ).length
                                                                                                           }
                                                                                                      </li>
                                                                                                 ))}
                                                                                            </ul>
                                                                                       </div>
                                                                                  </div>
                                                                             </div>
                                                                        </CardContent>
                                                                   </Card>
                                                              </TabsContent>
                                                         </Tabs>
                                                    </div>
                                               </div>
                                               </CardContent>
                                          </Card>
                                     </div>
                              </div>
                    </div>
               </>) : (<>Loading...</>)}

               {/* Save Confirmation Dialog */}
               <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                    <DialogContent>
                         <DialogHeader>
                              <DialogTitle>Save Changes</DialogTitle>
                              <DialogDescription>
                                   Are you sure you want to save your changes? This action cannot be undone.
                              </DialogDescription>
                         </DialogHeader>
                         <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">
                                   Summary of changes:
                              </p>
                              <ul className="text-sm list-disc list-inside space-y-1">
                                   <li>Total nodules: {boundingBoxes.length}</li>
                                   <li>Modified nodules: {
                                        boundingBoxes.filter(box => box.severity || box.notes).length
                                   }</li>
                              </ul>
                         </div>
                         <DialogFooter className="flex gap-2 mt-4">
                              <Button
                                   variant="outline"
                                   onClick={() => setShowSaveDialog(false)}
                              >
                                   Cancel
                              </Button>
                              <Button
                                   onClick={handleSaveConfirm}
                              >
                                   Save Changes
                              </Button>
                         </DialogFooter>
                    </DialogContent>
               </Dialog>
          </div>   
     );
}