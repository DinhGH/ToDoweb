"use client";

import { Task } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import Announce from "./Announce";

type FormProps = {
  task?: Task | null;
  tt: string;
  onClose: () => void;
  onAddTask: (task: Task) => void;
  onUpdateTask: (updateTask: Task) => void;
};

export default function Form({
  onClose,
  onAddTask,
  onUpdateTask,
  task,
  tt,
}: FormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    start: "",
    end: "",
    priority: "Medium",
  });

  const [announceKey, setAnnounceKey] = useState(0);

  const [showAnnounce, setShowAnnounce] = useState({
    show: false,
    title: "",
    mess: "",
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        date: task.date
          ? task.date.toString().slice(0, 10)
          : new Date().toISOString().split("T")[0],
        start: task.start || "",
        end: task.end || "",
        priority: task.priority || "Medium",
      });
    }
  }, [task]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = task ? `/api/editTask/${task.id}` : "/api/newTask";
    const method = task ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const resultTask = await res.json();
      if (task) {
        onUpdateTask(resultTask);
        setAnnounceKey((prev) => prev + 1);
        setShowAnnounce({
          show: true,
          title: "Success",
          mess: "Updating Completed",
        });

        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        onAddTask(resultTask);
        setAnnounceKey(announceKey + 1);
        setShowAnnounce({
          show: true,
          title: "Success",
          mess: "Adding Completed",
        });
      }
      setFormData({
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        start: "",
        end: "",
        priority: "Medium",
      });
    } else {
      setShowAnnounce({
        show: true,
        title: "Error",
        mess: "Can't send data",
      });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        ref={formRef}
        className="
          z-20
          w-1/2 h-auto max-sm:w-4/5
          space-y-4 mx-auto p-6
          text-black
          bg-white
          rounded-xl
          shadow absolute top-1/8 left-1/2 -translate-x-1/2
        "
      >
        <h1
          className="
            text-2xl font-bold text-center
          "
        >
          {tt}
        </h1>

        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="
              block
              w-full
              p-1
              border
              rounded
            "
          />
        </div>

        <div>
          <label htmlFor="title">Name:</label>
          <input
            required
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="
              block
              w-full
              p-1
              border
              rounded
            "
          />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            maxLength={312}
            className="
              block
              w-full
              p-1
              border
              rounded
            "
          />
        </div>
        <div
          className="
            flex
          "
        >
          <div
            className="
              grow-1
            "
          >
            <label htmlFor="priority">Priority:</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="
                block
                w-full
                p-1
                border
                rounded
              "
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>

        <div
          className="
            flex
            gap-4
          "
        >
          <div
            className="
              flex-1
            "
          >
            <label htmlFor="start">Start:</label>
            <input
              type="time"
              id="start"
              name="start"
              value={formData.start}
              onChange={handleChange}
              className="
                block
                w-full
                p-1
                border
                rounded
              "
            />
          </div>
          <div
            className="
              flex-1
            "
          >
            <label htmlFor="end">End:</label>
            <input
              type="time"
              id="end"
              name="end"
              value={formData.end}
              onChange={handleChange}
              className="
                block
                w-full
                p-1
                border
                rounded
              "
            />
          </div>
        </div>

        <div
          className="
            flex
            pt-4
            justify-end gap-4
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
              px-4 py-2
              bg-gray-300
              rounded hover:bg-gray-400
            "
          >
            Close
          </button>
          <button
            type="submit"
            className="
              px-7 py-2
              text-white
              bg-blue-500
              rounded hover:bg-blue-600
            "
          >
            Ok
          </button>
        </div>
      </form>
      {showAnnounce.show && (
        <Announce
          key={announceKey}
          title={showAnnounce.title}
          mess={showAnnounce.mess}
        />
      )}
    </>
  );
}
