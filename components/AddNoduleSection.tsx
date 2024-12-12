'use client'

import React, { useState, useEffect, useRef } from "react";
import * as fabric from 'fabric'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { BoundingBox } from "@/app/interface/BoundingBox";
// import { HoverCard, HoverCardContent,HoverCardTrigger } from "./ui/hover-card";

const AddNoduleSection = (props: any) => {

     const canvasRef = useRef(null);
     const[canvas,setCanvas] = useState<fabric.Canvas | null>(null);
     var isDown: boolean,isDrawingMode = true,origX: number, origY: number, rect: fabric.Rect;
     const [tooltipOpen, setTooltipOpen] = useState(false);
     const [tooltipPosition,setTooltipPosition] = useState({x:0,y:0});
     const [tooltipText,setTooltipText] = useState("");
     
     const rectRef = useRef<fabric.Rect | null>(null);

     const [selectedObject, setSelectedObject] = useState<any>(null);
     const [width, setWidth] = useState(0);
     const [height, setHeight] = useState(0);
     const [coords, setCoords] = useState([0,0]);
     const [color, setColor] = useState("");
     
     

     useEffect(() => {
          // If there's a reference to a canvas
          if(canvasRef.current){
            const initCanvas = new fabric.Canvas(canvasRef.current, {
              width: 416,
              height:416,
            });
      
            fabric.FabricImage.fromURL(props.imgPath).then(function(img) {
              initCanvas.backgroundImage = img;
              initCanvas.renderAll();
              
            })
          
            initCanvas.isDrawingMode = true;
          
      
            setCanvas(initCanvas);
            
            return () => {
              initCanvas.dispose();
            }
          } 
        },[])
     
        useEffect(() => {
          if(canvas){

               canvas.getObjects().forEach((obj) => {
                    if (obj.type === 'rect') canvas.remove(obj);
               });
               
               props.listOfBoxes.forEach((box: BoundingBox) => {
                         const initBox = new fabric.Rect({
                              left: (box.xCenter - box.height / 2) * 416 ,
                              top: (box.yCenter - box.width / 2) * 416,
                              width: box.width * 416,
                              height: box.height * 416,
                              angle: 0,
                              stroke: 'red',
                              strokeWidth: 2,
                              fill: "transparent",
                              transparentCorners: false
                         })
                         canvas.add(initBox);
               })


               canvas.requestRenderAll();
          }
        },[props.listOfBoxes, canvas])


          canvas?.on("mouse:down", (event) => {
               if(!isDrawingMode || !canvas.isDrawingMode) {
                    return;
               } else {
                    isDown = true;
                    var pointer = canvas?.getPointer(event.e);
                    origX = pointer.x;
                    origY = pointer.y;

                    rect = new fabric.Rect({
                    left: origX,
                    top: origY,
                    width: pointer.x - origX,
                    height: pointer.y - origY,
                    angle: 0,
                    stroke: 'red',
                    strokeWidth: 2,
                    fill: "transparent",
                    transparentCorners: false
                    })
                    
                    rectRef.current = rect;
                    canvas?.add(rect);
               }
               
          });
          canvas?.on("mouse:move", (event) => {
               if(!isDown || !isDrawingMode || !rectRef.current) return;
               var pointer = canvas?.getPointer(event.e);
          
               if(origX >pointer.x){
                    rectRef.current.set({ left: Math.abs(pointer.x)});
               }
          
               if(origY>pointer.y){
                    rectRef.current.set({top: Math.abs(pointer.y)});
               }
          
               rectRef.current.set({
                  width: Math.abs(origX - pointer.x),
                  height: Math.abs(origY - pointer.y),
                })
          
                canvas?.requestRenderAll();
          });
          canvas?.on("mouse:up", () => {
               isDown = false;
               if (isDrawingMode && rectRef.current) {
                    canvas.add(rectRef.current);
                    rectRef.current.set({ selectable: true });
                    let rect = rectRef.current;
                    // <p>{"0 " + (((coords[0]) + (width/2))/416) + " " + ((coords[1] + (height /2))/416) + " " + (width/416) + " " + (height/416)}</p>
                    handleAddNodule(0, (rect.left + (rect.width/2))/416 )
                    canvas.requestRenderAll();
                }
          });

          canvas?.on("mouse:dblclick", () => {
               isDrawingMode = !isDrawingMode;
               if(canvas){
                    canvas.isDrawingMode = isDrawingMode;
                    canvas.selection = !isDrawingMode;
                    canvas.requestRenderAll();
               }
          })

          canvas?.on('mouse:over', event => {
               // console.log('mouse:over', event.target);

               const pointer = canvas.getPointer(event.e);
         
               
               if (event.target) {
                    // console.log(event.target.fill);
                    
                    event.target.set({
                         // fill: '#007ac0',
                         // originalStroke: event.target.stroke,
                         // originalFill: event.target.fill,
                         shadow: '0 0 4px #007ac0',
                         // stroke: '#007ac0'
                    });
                    

                    setTooltipText("Khối u có khả năng gây ảnh hưởng xấu đến phổi");
                    setTooltipPosition({x: event.target.left, y: event.target.top});
                    setTooltipOpen(true);
                    canvas.requestRenderAll();
               }
          });
          
          canvas?.on('mouse:out', event => {
               // console.log('mouse:out', event.target);
               
               if (event.target) {
                    event.target.set({
                         // fill: event.target.originalFill,
                         shadow: null,
                         // stroke: event.target.originalStroke
                    });

                    setTooltipOpen(false);
                    
                    canvas.requestRenderAll();
               }
          });


          canvas?.on("selection:created", (event) => {
               handleObjectSelection(event.selected[0]);
          });

          canvas?.on("selection:updated", (event) => {
               handleObjectSelection(event.selected[0]);
          })


          canvas?.on("object:modified", (event) => {
               handleObjectSelection(event.target);
          })

          canvas?.on("object:scaling", (event) => {
               handleObjectSelection(event.target);
          })


          const handleObjectSelection = (object: any) => {
               if(!object) return;
     
               setSelectedObject(object);
     
               setWidth(Math.round(object.width * object.scaleX));
               setHeight(Math.round(object.height * object.scaleY));
               setCoords([object.oCoords["tl"].x,object.oCoords["tl"].y]);
               console.log(object.oCoords);
               setColor(object.stroke);
          }
     
          // const clearSettings = () => {
          //      setWidth(0);
          //      setHeight(0);
          //      setCoords([0,0]);
          //      setColor("");
          // }
     
          // const handleHeightChange = (e) => {
          //      const value = e.target.value.replace(/,/g,"");
          //      const intValue = parseInt(value,10);
     
          //      setHeight(intValue);
     
          //      if(selectedObject && selectedObject.type === "rect" && intValue >=0){
          //           selectedObject.set({height: intValue/selectedObject.scaleY});
          //           canvas.requestRenderAll();
          //      }
          // }
     
          // const handleWidthChange = (e) => {
          //      const value = e.target.value.replace(/,/g,"");
          //      const intValue = parseInt(value,10);
     
          //      setWidth(intValue);
     
          //      if(selectedObject && selectedObject.type === "rect" && intValue >=0){
          //           selectedObject.set({width: intValue / selectedObject.scaleX});
          //           canvas?.requestRenderAll();
          //      }
          // }
     
          const handleDeleteObject = () => {
               canvas?.remove(selectedObject);
               selectedObject.dispose();
               clearSettings();
               canvas?.requestRenderAll();
          }
     
          const handleAddNodule = (classId: number, xCenter: number, yCenter: number, width: number, height: number) => {
               var newNodule: BoundingBox = {classId: classId, xCenter: xCenter,yCenter: yCenter, width: width, height: height}
               props.addNodule(newNodule);
          }
     
          // const handleXPositionChange = (e) => {
          //      const value = e.target.value;
          //      const posValue = parseFloat(value);
     
          //      setCoords([posValue,coords[1]]);
          //      if(selectedObject && selectedObject.type === "rect" && posValue >=0){
          //           selectedObject.set({top: posValue});
          //           canvas.requestRenderAll();
          //      }
          // }
     
          // const handleYPositionChange = (e) => {
          //      const value = e.target.value;
          //      const posValue = parseFloat(value);
     
          //      setCoords([coords[0],posValue]);
          //      if(selectedObject && selectedObject.type === "rect" && posValue >=0){
          //           selectedObject.set({left: posValue});
          //           canvas.requestRenderAll();
          //      }
          // }


  return (
     <div>
     <TooltipProvider>
          <div className="relative">
               <canvas style={{ width: '100%' }} ref={canvasRef} />

               {/* Tooltip */}
               {tooltipOpen && (
                    <div
                         style={{
                              position: 'absolute',
                              top: tooltipPosition.y,
                              left: tooltipPosition.x,
                              pointerEvents: 'none',
                         }}
                    >
                         <Tooltip open={tooltipOpen}>
                              <TooltipTrigger asChild>
                                   <span></span>
                              </TooltipTrigger>
                              <TooltipContent>
                                   {tooltipText}
                              </TooltipContent>
                         </Tooltip>
                    </div>
               )}
          </div>
     </TooltipProvider>
</div>
  )
}

export default AddNoduleSection