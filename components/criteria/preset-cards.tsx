// CriteriaCard.tsx
import Card from "../general/card";
import Singles from "@/app/images/singles.png";
import YoungCouple from "@/app/images/youngcouple.png";
import Family from "@/app/images/family.png";
import { PresetCriteriaType } from "@/lib/entities/criteria-entity";


interface CriteriaProps {
    type: PresetCriteriaType;
}

export default function CriteriaCard({ type }: CriteriaProps) {
    const imageMap: { [key in PresetCriteriaType]: string } = {
        "Singles": Singles.src,
        "Young Couple": YoungCouple.src,
        "Family": Family.src,
    };

    return (
        <Card className="bg-[#EEEEEE] flex flex-col justify-center gap-2">
            <h3 className="font-semibold text-2xl text-center">{type}</h3>
            <img src={imageMap[type]} alt={type} className="object-contain h-32 w-32 block m-auto" />
        </Card>
    );
}
