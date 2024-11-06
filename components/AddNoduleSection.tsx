'use client'

import React, { useState, useEffect, useRef } from "react";
import * as fabric from 'fabric'
import NoduleSettings from "./NoduleSettings";
const AddNoduleSection = () => {

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
      
            fabric.FabricImage.fromURL("/ct_images/images/val/1_jpg.rf.4a59a63d0a7339d280dd18ef3c2e675a.jpg").then(function(img) {
              initCanvas.backgroundImage = img;
            })
      
            initCanvas.isDrawingMode = true;
            initCanvas.renderAll();
      
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
                    strokeWidth: 5,
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
                    canvas.renderAll();
                }
          });
          canvas?.on("mouse:dblclick", () => {
               isDrawingMode = !isDrawingMode;
               if(canvas){
                    canvas.isDrawingMode = isDrawingMode;
                    canvas.selection = !isDrawingMode;
                    canvas.renderAll();
               }
          })

  return (
    <div>
          <div className="grid grid-cols-12">
               <canvas id="canvas" ref={canvasRef}/>
               <NoduleSettings canvas={canvas} />
               
          </div>
    </div>
  )
}

export default AddNoduleSection