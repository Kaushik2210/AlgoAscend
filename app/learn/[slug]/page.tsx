import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { lessons } from "@/lib/curriculum";
import { LessonView } from "@/components/lesson-view";

export function generateStaticParams() {
  return lessons.map(lesson => ({slug: lesson.id}));
}

export default async function LessonPage({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const lesson = lessons.find(item => item.id === slug);
  if (!lesson) notFound();
  return <div className="shell inner-page"><div className="section-marker eyebrow"><BookOpen size={16}/> LESSON · {lesson.minutes} MIN</div><h1>{lesson.title}</h1><p className="lede">{lesson.objective}</p><LessonView lesson={lesson}/></div>;
}
