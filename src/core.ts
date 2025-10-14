/**
 * 
 *  .from() and .to() could work for simple fade-in animations
    .add("nameOfAnimation", {from: {}, to: {}}) and then we can ref.play("nameOfAnimation") imperatively on certain button clicks or whatever???
    .fork(someBoolean, {from :{}, to: {}}, {from: {}, to:{}) could be a more declarative ternary for former if true, latter if false???
    .stateMachine({ some sort of huge config here})
 */

import { useEffect, useRef, useState } from "react";
import { triggerAnimations } from "./utils";

export type FromToAnimation = {
    from: any;
    to: any;
};

export function useFromTo() {
    const [mounted, setMounted] = useState(false);

    const ref = useRef<any>(null);
    const [bool, setBool] = useState(false);

    const [animations, setAnimations] = useState<FromToAnimation[]>([]);

    // This is a callback ref, so it only gets called once when the element is mounted
    const setRef = (el: HTMLDivElement) => {
        if (el && !mounted) {
            ref.current = el;
            setMounted(true);

            console.log(ref.current);
        }
    };

    useEffect(() => {
        if (!mounted) {
            return;
        }

        
        triggerAnimations(ref, bool, animations);
       
        
    }, [bool, mounted, animations]);

    function registerAnimation(config: FromToAnimation) {
        setAnimations(prev => {
            const newAnimations = [...prev, config];
            return newAnimations;
        });
    }

    function add(config: FromToAnimation) {
        registerAnimation(config);
    }

    return [bool, setBool, { ref, setRef, add }] as const;
}
