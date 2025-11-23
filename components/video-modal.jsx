"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

export default function VideoModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size="lg"
                    variant="outline"
                    className="px-8 bg-white text-primary hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/20"
                >
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Watch Demo
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-transparent border-none shadow-none">
                <DialogHeader className="sr-only">
                    <DialogTitle>Demo Video</DialogTitle>
                </DialogHeader>
                <div className="relative pt-[56.25%] bg-black rounded-lg overflow-hidden shadow-2xl">
                    <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
                        title="Demo Video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </DialogContent>
        </Dialog>
    );
}
