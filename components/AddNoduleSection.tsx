'use client'

import React, { useState, useEffect, useRef } from "react";
import * as fabric from 'fabric'
import NoduleSettings from "./NoduleSettings";
import {BoundingBox} from "@/app/interfaces/BoundingBox";
import { Button } from "./ui/button";

const AddNoduleSection = (props: any) => {

     const canvasRef = useRef(null);
     const[canvas,setCanvas] = useState<fabric.Canvas | null>(null);
     var isDown: boolean,isDrawingMode = true,origX: number, origY: number, rect: fabric.Rect;
     // const [isDown, setIsDown] = useState(false);

     
     // const [isDrawingMode, setIsDrawingMode] = useState(true);
     const rectRef = useRef<fabric.Rect | null>(null);
     
     

     useEffect(() => {
          // If there's a reference to a canvas
          if(canvasRef.current){
            const initCanvas = new fabric.Canvas(canvasRef.current, {
              width: 416,
              height:416,
            });
      
            fabric.FabricImage.fromURL(`${'http://127.0.0.1:8000/images/'+props.diagnosisDetail.photo_path.replace("uploads\\",'')}`).then(function(img) {
              initCanvas.backgroundImage = img;
            })
      
            initCanvas.isDrawingMode = true;
            initCanvas.requestRenderAll();
      
            setCanvas(initCanvas);
            
            return () => {
              initCanvas.dispose();
            }
          } 
        },[])
     

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
                    rectRef.current.set({ selectable: true });
                    canvas.requestRenderAll();
                }
          });


          const toggleDrawing =()=> {
               isDrawingMode = !isDrawingMode;
               if(canvas){
                    canvas.isDrawingMode = isDrawingMode;
                    canvas.selection = !isDrawingMode;
                    canvas.requestRenderAll();
               }
          }



  return (
    <div>
          <div>

               <Button onClick={toggleDrawing}>Toggle Edit</Button>
               <canvas id="canvas" ref={canvasRef}/>
               <br/>
               <NoduleSettings canvas={canvas} addNodule={props.addNodule}/>
          </div>
    </div>
  )
}

export default AddNoduleSection