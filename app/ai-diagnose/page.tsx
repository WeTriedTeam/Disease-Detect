import { Button } from "@/components/ui/button"
import UploadImage from "../upload/page"
export default function AIDiagPage(){
     return(
          <div>
               <div className="flex items-center">
                    <h1 className="text-lg font-semibold md:text-2xl">AI Diagnosis</h1>
               </div>
                    <div
                    className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
                    >
                         <UploadImage/>
                    </div>
          </div>
     )
}