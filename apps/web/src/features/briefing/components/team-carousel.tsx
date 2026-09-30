"use client";

import { cn } from "@paddy-field/ui/lib/utils";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

type Member = { name: string; title: string; photo: StaticImageData };

export function TeamCarousel({ members }: { members: Member[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  const isPaused = isPointerInside || !isInView;

  useEffect(function pauseWhenOffscreen() {
    const list = listRef.current;
    if (!list) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  // On phones the row scrolls sideways, so keep the focused portrait visible.
  useEffect(
    function scrollActiveIntoRow() {
      const list = listRef.current;
      const item = list?.children[activeIndex];
      if (!list || !item || list.scrollWidth <= list.clientWidth) return;
      const offset = item.getBoundingClientRect().left - list.getBoundingClientRect().left;
      list.scrollBy({ left: offset - 24, behavior: "smooth" });
    },
    [activeIndex],
  );

  function showNextMember() {
    setActiveIndex((index) => (index + 1) % members.length);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <ul
        ref={listRef}
        onPointerEnter={() => setIsPointerInside(true)}
        onPointerLeave={() => setIsPointerInside(false)}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-4 sm:h-112 sm:overflow-visible sm:pb-0"
      >
        {members.map(function renderMember(member, index) {
          return (
            <li
              key={member.name}
              data-active={index === activeIndex}
              className="group relative h-80 w-52 shrink-0 snap-start overflow-hidden rounded-4xl bg-muted transition-all duration-700 ease-out motion-reduce:transition-none sm:h-auto sm:w-auto sm:shrink sm:grow sm:data-[active=true]:grow-3"
            >
              <button
                type="button"
                tabIndex={-1}
                aria-label={`Show ${member.name}`}
                onClick={() => setActiveIndex(index)}
                className="absolute inset-0 cursor-pointer text-left"
              >
                <Image
                  src={member.photo}
                  alt={`Portrait of ${member.name}`}
                  fill
                  placeholder="blur"
                  quality={90}
                  sizes="(min-width: 640px) 40vw, 20rem"
                  className="object-cover object-top transition-transform duration-700 ease-out group-data-[active=true]:scale-105 motion-reduce:transition-none"
                />
                <div
                  aria-hidden
                  className="briefing-caption-blur absolute inset-x-0 bottom-0 h-44"
                />
                <div className="absolute inset-x-0 bottom-0 h-25 bg-linear-to-t from-black/60 to-transparent p-4">
                  <p className="font-heading text-2xl font-semibold text-white">{member.name}</p>
                  <p className="text-sm text-ellipsis text-white/80">{member.title}</p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div
        role="group"
        aria-label="Choose a team member"
        data-paused={isPaused}
        className="mt-6 flex justify-center"
      >
        {members.map(function renderIndicator(member, index) {
          const isActive = index === activeIndex;
          return (
            <button
              key={member.name}
              type="button"
              aria-label={`Show ${member.name}`}
              aria-pressed={isActive}
              onClick={() => setActiveIndex(index)}
              className="p-1.5"
            >
              <span
                className={cn(
                  "relative block h-2 overflow-hidden rounded-full bg-muted-foreground/30 transition-all duration-300 ease-out motion-reduce:transition-none",
                  isActive ? "w-8" : "w-2",
                )}
              >
                {isActive ? (
                  <span
                    key={activeIndex}
                    onAnimationEnd={showNextMember}
                    className="briefing-progress absolute inset-0 origin-left rounded-full bg-primary"
                  />
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
