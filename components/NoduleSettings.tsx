import { useState,useEffect } from "react";

function NoduleSettings({canvas}) {
     const [selectedObject, setSelectedObject] = useState<any>(null);
     const [width, setWidth] = useState(0);
     const [height, setHeight] = useState(0);
     const [coords, setCoords] = useState([0,0]);
     const [color, setColor] = useState("");

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
          setCoords([object.oCoords["ml"].x,object.oCoords["ml"].y]);
          setColor(object.stroke);
     }

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
               canvas.renderAll();
          }
     }

     const handleWidthChange = (e) => {
          const value = e.target.value.replace(/,/g,"");
          const intValue = parseInt(value,10);

          setWidth(intValue);

          if(selectedObject && selectedObject.type === "rect" && intValue >=0){
               selectedObject.set({width: intValue / selectedObject.scaleX});
               canvas.renderAll();
          }
     }

     const handleDeleteObject = () => {
          canvas.remove(selectedObject);
          
          canvas.renderAll();
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
               </div>
          )}
          </>
     )
}

export default NoduleSettings;