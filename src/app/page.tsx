"use client";
import { useEffect, useState } from "react";
import Form from "./components/Form";
import { Task } from "@prisma/client";
import { FaGrip } from "react-icons/fa6";
import DropdownMenu from "./components/DropdownMenu";
import Announce from "./components/Announce";
import Confirm from "./components/Confirm";

export default function Home() {
  const [selectedButton, setSelectedButton] = useState("To-Do");
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [showAnnounce, setShowAnnounce] = useState({
    show: false,
    title: "",
    mess: "",
  });
  const [announceKey, setAnnounceKey] = useState(0);
  const [messConfirm, setMessConfirm] = useState("");
  const [confirmKey, setConfirmKey] = useState(0);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [confirmAction, setConfirmAction] = useState<"delete" | "done" | null>(
    null,
  );

  useEffect(() => {
    fetch("/api/getTask")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  useEffect(() => {
    const checkAndUpdateFailTasks = async () => {
      const now = new Date();

      const tasksToUpdate = tasks.filter((task) => {
        if (task.status === "Done" || task.status === "Fail") return false;

        const taskDate = new Date(task.date);
        const today = new Date(now.toDateString());

        if (taskDate < today) return true;

        if (taskDate.toDateString() === now.toDateString()) {
          const [endHour, endMinute] = (task.end ?? "00:00")
            .split(":")
            .map(Number);

          const endTime = new Date(taskDate);
          endTime.setHours(endHour, endMinute, 0, 0);

          if (now > endTime) return true;
        }

        return false;
      });

      if (tasksToUpdate.length > 0) {
        for (const task of tasksToUpdate) {
          try {
            await fetch(`/api/updateTask/${task.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ status: "Fail" }),
            });
          } catch (error) {
            console.error("Failed to update task to Fail:", error);
          }
        }

        const updated = await fetch("/api/getTask").then((res) => res.json());
        setTasks(updated);
      }
    };

    checkAndUpdateFailTasks();
    const interval = setInterval(checkAndUpdateFailTasks, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  const handleMarkAsDone = (id: number) => {
    setConfirmId(id);
    setMessConfirm("Are you sure to mark this task as completed?");
    setConfirmAction("done");
    setOpenDropdownId(null);
    setConfirmKey(confirmKey + 1);
  };

  const handleConfirmMarkAsDone = async (id: number) => {
    try {
      const res = await fetch(`/api/updateTask/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Done" }),
      });

      if (res.ok) {
        const updatedTasks = await fetch("/api/getTask").then((res) =>
          res.json(),
        );
        setTasks(updatedTasks);
        setOpenDropdownId(null);
        setAnnounceKey(announceKey + 1);
        setShowAnnounce({
          show: true,
          title: "Success",
          mess: "Task Completed",
        });
      } else {
        setAnnounceKey(announceKey + 1);
        setShowAnnounce({
          show: true,
          title: "Error",
          mess: "Task Incompleted",
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setConfirmId(null);
    }
  };

  const handleDeleteTask = (id: number) => {
    setConfirmId(id);
    setMessConfirm("Are you sure to delete this task?");
    setConfirmAction("delete");
    setOpenDropdownId(null);
    setConfirmKey(confirmKey + 1);
  };

  const handleConfirmDelete = async (id: number) => {
    try {
      const res = await fetch(`api/deleteTask/${id}`, { method: "DELETE" });

      if (res.ok) {
        const updatedTasks = await fetch("/api/getTask").then((res) =>
          res.json(),
        );
        setTasks(updatedTasks);
        setOpenDropdownId(null);
        setAnnounceKey(announceKey + 1);
        setShowAnnounce({
          show: true,
          title: "Success",
          mess: "Deleting Completed",
        });
      } else {
        setAnnounceKey(announceKey + 1);
        setShowAnnounce({
          show: true,
          title: "Error",
          mess: "Deleting Incompleted",
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setConfirmId(null);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
    setOpenDropdownId(null);
  };

  const filterTasks = tasks.filter((task) => {
    const matchStatus =
      selectedButton === "All"
        ? true
        : selectedButton === "Completed"
          ? task.status === "Done"
          : selectedButton === "To-Do"
            ? task.status === "To-Do"
            : task.status === "Fail";

    const matchDate =
      selectedDate === "" ||
      new Date(task.date).toISOString().split("T")[0] === selectedDate;

    return matchStatus && matchDate;
  });
  return (
    <>
      <div
        style={{
          background: "linear-gradient(to bottom, #A4BAEE, #969FBE)",
        }}
        className="
          w-10/12 h-11/12 max-sm:w-11/12 max-sm:px-3 min-w-[370px]
          mx-auto mt-4 py-9 px-11
          rounded-4xl
          relative
        "
      >
        <h1
          className="
            mb-8
            text-center text-4xl
          "
        >
          TODO
        </h1>

        <div
          className="
            flex
          "
        >
          <button
            onClick={() => setShowForm(true)}
            className="
              max-sm:mr-5
              py-2 mr-15
              text-black
              bg-[#E8ECF8]
              rounded-lg
              hover:bg-[#5180F6] hover:text-white grow-2
            "
          >
            Add new
          </button>
          {["All", "To-Do", "Fail", "Completed"].map((btn) => {
            const isSelected = selectedButton === btn;
            const baseStyle = `
              max-md:mx-1
              py-2 mx-4 max-md:px-1
              rounded-lg
              grow-1
              text-black
            `;

            let bgStyle = "";
            if (isSelected) {
              if (btn === "Fail") bgStyle = "bg-red-300 text-white";
              else if (btn === "Completed") bgStyle = "bg-green-300 text-white";
              else bgStyle = "bg-[#5180F6] text-white";
            } else {
              bgStyle = "bg-[#E8ECF8] hover:text-white";
              if (btn === "Fail") bgStyle += " hover:bg-red-300";
              else if (btn === "Completed") bgStyle += " hover:bg-green-300";
              else bgStyle += " hover:bg-[#5180F6]";
            }

            return (
              <button
                key={btn}
                onClick={() => setSelectedButton(btn)}
                className={`
                  ${baseStyle}
                  ${bgStyle}
                `}
              >
                {btn}
              </button>
            );
          })}
        </div>

        <div
          className="
            overflow-y-auto
            w-full h-9/12
            my-7
            text-black
            bg-[#E8ECF8]
            rounded-2xl
            custom-scrollbar
          "
        >
          <table
            className="
              w-full
              text-left
              border-collapse
              table-auto
            "
          >
            <thead
              className="
                z-10
                bg-[#c3d3f0]
                sticky top-0
              "
            >
              <tr>
                {[
                  "Title",
                  "Description",
                  "Date",
                  "Start",
                  "End",
                  "Priority",
                  "Action",
                ].map((th) => {
                  if (th === "Date") {
                    return (
                      <th
                        key={th}
                        className="
                          text-center
                          bg-[#c3d3f0]
                        "
                      >
                        <div
                          className="
                            flex flex-row
                            items-center justify-center
                          "
                        >
                          <input
                            type="date"
                            id="filterDate"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="
                              text-black text-sm
                              rounded outline-0
                            "
                          />
                        </div>
                      </th>
                    );
                  }

                  return (
                    <th
                      key={th}
                      className="
                        p-2
                        text-center
                        bg-[#c3d3f0]
                      "
                    >
                      {th}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {filterTasks.map((task) => (
                <tr
                  key={task.id}
                  className={`
                    border-t border-gray-400
                    ${
                    task.status === "Done"
                    ? " bg-green-300 hover:bg-[#a4e7b9]"
                    : task.status === "Fail"
                    ? "bg-red-300 hover:bg-[#e5afaf]"
                    : " hover:bg-[#d8e2e0]"
                    }
                  `}
                >
                  <td
                    className="
                      max-w-[70px] max-sm:max-w-[240px]
                      p-2
                      text-center break-words whitespace-normal
                    "
                  >
                    {task.title}
                  </td>
                  <td
                    className="
                      max-w-[100px] max-sm:max-w-[350px]
                      p-2
                      text-center break-words whitespace-normal
                    "
                  >
                    {task.description}
                  </td>
                  <td
                    className="
                      p-2
                      text-center
                    "
                  >
                    {new Date(task.date).toLocaleDateString()}
                  </td>
                  <td
                    className="
                      p-2
                      text-center
                    "
                  >
                    {task.start}
                  </td>
                  <td
                    className="
                      p-2
                      text-center
                    "
                  >
                    {task.end}
                  </td>
                  <td
                    className="
                      p-2
                      text-center
                    "
                  >
                    {task.priority}
                  </td>
                  <td
                    className="
                      p-2
                      text-center
                      relative
                    "
                  >
                    <FaGrip
                      onClick={() =>
                        setOpenDropdownId(
                          openDropdownId === task.id ? null : task.id,
                        )
                      }
                      className="
                        mx-auto
                        cursor-pointer
                        hover:scale-110
                      "
                    />
                    {openDropdownId === task.id && (
                      <DropdownMenu
                        onClose={() => setOpenDropdownId(null)}
                        onDone={() => handleMarkAsDone(task.id)}
                        onEdit={() => handleEditTask(task)}
                        onDelete={() => handleDeleteTask(task.id)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <Form
            task={editingTask}
            tt={editingTask ? "Edit Task" : "New Task"}
            onClose={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
            onAddTask={(newTask) => setTasks([newTask, ...tasks])}
            onUpdateTask={(updateTask) => {
              setTasks(
                tasks.map((t) => (t.id === updateTask.id ? updateTask : t)),
              );
            }}
          />
        )}
      </div>
      {showAnnounce.show && (
        <Announce
          key={announceKey}
          title={showAnnounce.title}
          mess={showAnnounce.mess}
        />
      )}

      {confirmId !== null && confirmAction !== null && (
        <Confirm
          key={confirmKey}
          mess={messConfirm}
          onClose={() => {
            setConfirmId(null);
            setConfirmAction(null);
          }}
          onConfirm={() => {
            if (confirmAction === "delete") handleConfirmDelete(confirmId);
            else if (confirmAction === "done")
              handleConfirmMarkAsDone(confirmId);
          }}
        />
      )}
    </>
  );
}
