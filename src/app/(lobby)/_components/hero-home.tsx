import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image"

interface HeroHomeProps {
    className?: string
}

export default function HeroHome({className}: HeroHomeProps) {

    return (
        <div>
            {/* <Card className={cn("relative", className)}> */}
                {/* <CardContent className="p-0"> */}
                    <div className="image-container relative lg:w-96 w-56 " >

                        <div className="image-bg absolute inset-0 rounded-full
                        bg-[image:var(--vp-home-hero-image-background-image)]  
                        blur-3xl xl:-translate-x-1/8
                        ">
                        </div>
                        <div className="image-bg absolute inset-0 rounded-lg xl:-translate-x-1/8" />


                        <AspectRatio ratio={4 / 3}>
                            <Image
                                src="/home.png"
                                alt="/home.png"
                                className="object-cover xl:-translate-x-1/8"
                                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                                fill
                                loading="lazy"
                            />
                        </AspectRatio>
                    </div>
                {/* </CardContent> */}
            {/* </Card> */}
        </div>
    )
}