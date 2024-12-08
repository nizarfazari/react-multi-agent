import BubleChat from "./BubleChat";
import { useContext, useEffect, useRef, useState } from "react";
import ChatHeadersAI from "./ChatHeadersAI";
import { FileImage, PaperPlaneTilt } from "@phosphor-icons/react";
import { AppContext } from "../context/buble";
import { Message , MessageResponse as messageResponse } from "../data/message";


const ChatContentAI = () => {
  const { buble, setBuble } = useContext(AppContext);
  console.log(buble);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [formData, setFormData] = useState({
    message: "",
    file: null,
  });

  useEffect(() => {
    const startTime = Date.now();
    let index = 0;
    setIsTyping(true);

    const interval = setInterval(() => {
      if (index < Message.length) {
        // console.log("Current message:", data);
        const now = Date.now();
        const elapsedTime = now - startTime;
        const timeExecution = elapsedTime - (index + 1) * 3000;
        setBuble((prevMessages) => {
          const updatedMessages = [
            ...prevMessages,
            {
              ...Message[index],
              id: index,
              time_execution: `${timeExecution} ms`,
            },
          ];
          //   console.log("Updated messages:", updatedMessages);
          return updatedMessages;
        });

        setTimeout(() => {
          index++;
        }, 2000);
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      message: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        file: e.target.files[0],
      }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

   
    const newMessage = {
      sender: "User",
      content: formData.message,
      time: new Date().toLocaleString(),
      photo: "/public/diomendes.webp",
    };
    setBuble((prevMessages) => [...prevMessages, newMessage]);
    setFormData({
      message: "",
      file: null,
    });

    messageResponse.forEach((msg, index) => {
      setTimeout(() => {
        setBuble((prevMessages) => [...prevMessages, { ...msg }]);
        if (index === messageResponse.length - 1) {
          setIsTyping(false);
        }
      }, (index + 1) * 2000);
    });
  };

  return (
    <div className=" col-span-5">
      <ChatHeadersAI />
      <div className="bg-[#F7FBFC] px-4 py-3 bg-[#F7FBFC] bg-cover rounded-lg h-[700px] overflow-y-auto custom-scrollbar">
        <div className="flex flex-col gap-4 my-4">
          {buble.map(
            (message, index) =>
              message && (
                <>
                  <BubleChat key={index} messages={message} />
                  <div ref={messagesEndRef} />
                </>
              )
          )}

          {isTyping && (
            <div className="loader">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          )}
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg border border-slate-400 rounded-lg mt-3"
      >
        <textarea
          placeholder="Message"
          value={formData.message}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          className="w-full outline-none p-4 bg-transparent border-none resize-none focus:ring-0"
        ></textarea>
        <div className="p-4 flex justify-between items-center">
          <div>
            <label htmlFor="file-upload" className="cursor-pointer">
              <FileImage size={25} className="text-gray-600" weight="fill" />
            </label>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <button type="submit" className="focus:outline-none">
            <PaperPlaneTilt className="text-gray-700" size={22} weight="fill" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatContentAI;
