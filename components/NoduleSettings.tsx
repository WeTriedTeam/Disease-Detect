import { useState,useEffect } from "react";
import { DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import {BoundingBox} from "@/app/interface/BoundingBox";
import { Input } from "./ui/input";

function Settings({canvas, addNodule}) {


  



     return (
          <>
          {selectedObject && selectedObject.type === "rect" && (
               <div>
                    <Input type="number" value={height} onChange={handleHeightChange} />
                    <Input type="number" value={width} onChange={handleWidthChange} />
                    <Input type="number" onChange={handleXPositionChange} value={coords[0]} />
                    <Input type="number" onChange={handleYPositionChange} value={coords[1]} />
                    <Button className="mt-3" type="button" onClick={handleDeleteObject}>Delete</Button>
                    {/* <p>{"0 " + (((coords[0]) + (width/2))/416) + " " + ((coords[1] + (height /2))/416) + " " + (width/416) + " " + (height/416)}</p> */}
                    <DialogClose>
                         <Button className="mt-3" type="submit" onClick={() => handleAddNodule(0, (((coords[0]) + (width/2))/416), ((coords[1] + (height /2))/416), (width/416), (height/416))}>Add Nodule</Button>
                    </DialogClose>
                    
               </div>
          )}
          </>
     )
}

export default Settings;