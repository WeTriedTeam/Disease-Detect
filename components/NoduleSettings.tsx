import { useState,useEffect } from "react";
import { DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import {BoundingBox} from "@/app/interface/BoundingBox";

function Settings({canvas, addNodule}) {
     const [selectedObject, setSelectedObject] = useState<any>(null);
     const [width, setWidth] = useState(0);
     const [height, setHeight] = useState(0);
     const [coords, setCoords] = useState([0,0]);
     const [color, setColor] = useState("");
     const [exampleOutput, setExampleOutput] = useState("");

     useEffect(() => {
          if(canvas){
               canvas.on("selection:created", (event) => {
                    handleObjectSelection(event.selected[0]);
               })

               canvas.on("selection:updated", (event) => {
                    handleObjectSelection(event.selected[0]);
               })

               canvas.on("selection:clear", () => {
                    setSelectedObject(null);
                    clearSettings();
               })

               canvas.on("selection:modified", (event) => {
                    handleObjectSelection(event.target);
               })

               canvas.on("selection:scaling", (event) => {
                    handleObjectSelection(event.target);
               })
          }
     },[canvas])

     const handleObjectSelection = (object: any) => {
          if(!object) return;

          setSelectedObject(object);

          setWidth(Math.round(object.width * object.scaleX));
          setHeight(Math.round(object.height * object.scaleY));
          setCoords([object.oCoords["tl"].x,object.oCoords["tl"].y]);
          console.log(object.oCoords);
          setColor(object.stroke);
     }

     
     // x={(xCenter - width / 2) * 416} => xCenter = x/416 + width /2
     // y={(yCenter - height / 2) * 416} => yCenter = (y + height /2)/416
     // width={box.width * 416} => box width: width /416
     // height={box.height * 416} => box height: height / 416

     const clearSettings = () => {
          setWidth(0);
          setHeight(0);
          setColor("");
     }

     const handleHeightChange = (e) => {
          const value = e.target.value.replace(/,/g,"");
          const intValue = parseInt(value,10);

          setHeight(intValue);

          if(selectedObject && selectedObject.type === "rect" && intValue >=0){
               selectedObject.set({height: intValue/selectedObject.scaleY});
               canvas.requestRenderAll();
          }
     }

     const handleWidthChange = (e) => {
          const value = e.target.value.replace(/,/g,"");
          const intValue = parseInt(value,10);

          setWidth(intValue);

          if(selectedObject && selectedObject.type === "rect" && intValue >=0){
               selectedObject.set({width: intValue / selectedObject.scaleX});
               canvas.requestRenderAll();
          }
     }

     const handleDeleteObject = () => {
          canvas.remove(selectedObject);
          selectedObject.dispose();
          canvas.requestRenderAll();
     }

     const handleAddNodule = (classId: number, xCenter: number, yCenter: number, width: number, height: number) => {
          var newNodule: BoundingBox = {classId: classId, xCenter: xCenter,yCenter: yCenter, width: width, height: height}
          addNodule(newNodule);
     }


     return (
          <>
          {selectedObject && selectedObject.type === "rect" && (
               <div>
                    <input type="number" value={height} onChange={handleHeightChange} />
                    <input type="number" value={width} onChange={handleWidthChange} />
                    <input type="number" readOnly value={coords[0]} />
                    <input type="number" readOnly value={coords[1]} />
                    <button type="button" onClick={handleDeleteObject}>Delete</button>
                    {/* <p>{"0 " + (((coords[0]) + (width/2))/416) + " " + ((coords[1] + (height /2))/416) + " " + (width/416) + " " + (height/416)}</p> */}
                    <DialogFooter>
                         <DialogClose asChild>
                              <Button type="submit" onClick={() => handleAddNodule(0, (((coords[0]) + (width/2))/416), ((coords[1] + (height /2))/416), (width/416), (height/416))}>Add Nodule</Button>
                         </DialogClose>
                    </DialogFooter>
               </div>
          )}
          </>
     )
}

export default Settings;