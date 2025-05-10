import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Checkbox, Divider } from "@heroui/react";
import { Button } from "@heroui/button";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { Question } from "@/components/question-panel";
import { createBookmark, deleteBookmark } from "@/lib/api/bookmarks";

interface QuestionCardProps {
  questionData: Question;
  isBookmarked: boolean;
  onBookmarkEvent: () => void;
}

export default function QuestionCard({ questionData, isBookmarked, onBookmarkEvent }: QuestionCardProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const [validated, setValidated] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const { data: session } = useSession();

  const requiredCount = questionData.options.filter((o) => o.isCorrect).length;

  const toggleSelection = (index: number) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };


  const handleBookmark = async (examId: string, questionId: number) => {
    try {
      if (bookmarked) {
        await deleteBookmark(session, examId, questionId);
      }
      else {
        await createBookmark(session, examId, questionId);
      }
    } catch (err) {
      console.error('Error bookmarking:', err);
    }

  };

  return (
    <Card className="max-w-4xl space-y-2 rounded-4xl shadow-lg">
      <CardHeader className="pl-6 pr-6 justify-between">
        <div className="pt-2 flex gap-4">
          <h2 className="pt-1.5 text-xl font-semibold">
            Question #{questionData.questionId + 1}
          </h2>
          <Button
            isIconOnly
            aria-label="Like"
            color="primary"
            className="data-[hover]:bg-foreground/10"
            radius="full"
            variant="light"
            onPress={() => {
                onBookmarkEvent();
                setBookmarked(!bookmarked)
                handleBookmark(questionData.examId, questionData.questionId)
              }
            }
          >
            {
              bookmarked ?
                <FaBookmark className="text-xl" /> :
                <FaRegBookmark className="text-xl" />
            }
          </Button>
        </div>
        <Button isDisabled color="warning" size="sm" radius="full" variant="bordered">
          <b>{questionData.examId}</b>
        </Button>
      </CardHeader>

      <div className="pl-6 pr-6">
        <Divider />
      </div>

      <CardBody className="space-y-3 pl-6 pr-6">

        <p className="text-base leading-relaxed pb">{questionData.question}</p>

        {questionData.s3ImageUrls.length > 0 && (
          <div className="grid grid-cols-1 gap-2">
            {questionData.s3ImageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Question ${questionData.questionId} ${index + 1}`}
                className="rounded-lg border"
              />
            ))}
          </div>
        )}

        <ul className="space-y-3">
          {questionData.options.map((opt, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 p-2 rounded-lg"
            >
              <div>
                <Checkbox
                  className="pl-2"
                  color={validated && opt.isCorrect ? "success" : validated ? "danger" : "primary"}
                  isSelected={(validated && opt.isCorrect) || selected.includes(idx)}
                  isDisabled={validated}
                  radius="full"
                  onChange={() => toggleSelection(idx)}
                >
                  <p className="pl-2 text-sm">{opt.text}</p>
                </Checkbox>
                {opt.s3ImageUrls.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {opt.s3ImageUrls.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Option ${idx + 1} ${i + 1}`}
                        className="rounded-lg border"
                      />
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        <Divider />

        <Button
          className="min-w-full"
          color={selected.length !== requiredCount || validated ? "default": "primary"}
          onPress={() => setValidated(!validated)}
          disabled={selected.length !== requiredCount && !validated}
          radius="none"
        >
          {validated ? "Redo" : "Validate"}
        </Button>

        <div></div>
      </CardBody>
    </Card>
  );
}
