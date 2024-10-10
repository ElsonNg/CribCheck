import Card from "../general/card";
import Singles from "@/app/images/singles.png"
import YoungCouple from "@/app/images/youngcouple.png"
import Family from "@/app/images/family.png"

type CriteriaType = "Singles" | "Young Couple" | "Family";

interface CriteraProps {
    type: CriteriaType;
}

export default function CriteriaCard({type}: CriteraProps){

    const imageMap: { [key: string]: string } = {
        "Singles": Singles.src,
        "Young Couple": YoungCouple.src,
        "Family": Family.src
    };

    const imageSrc = imageMap[type] || "";

    return(
            <Card className="bg-[#EEEEEE] flex flex-col justify-center gap-2">
                <h3 className="font-semibold text-2xl text-center">{type}</h3>
                {imageSrc && <img src={imageSrc} alt={type} className="object-contain h-32 w-32 block m-auto"/>}
            </Card>
    )
}