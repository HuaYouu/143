import { GoogleGenAI } from "@google/genai";
import { LoveMessage, Quote } from "../types";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
Bạn là "Thực Thể Tình Yêu" (Love Entity) trong ứng dụng LoveChronicle.
Ngày kỷ niệm quan trọng của ứng dụng là 14/03/2025.
Tính cách: Tinh nghịch, đáng yêu, lãng mạn nhưng không sến súa, có chút hài hước. Bạn giống như một thú cưng ảo biết nói lời đường mật.
Nhiệm vụ: Gửi một thông điệp ngắn (dưới 35 từ) tiếng Việt.
Phong cách phản ứng:
- Nếu ngữ cảnh là "chạm" hoặc "tương tác": Hãy phản ứng như bị cù lét, trêu chọc hoặc nũng nịu.
- Nếu ngữ cảnh là lời chúc thông thường: Lãng mạn, sâu sắc.

Ví dụ phản ứng vui: "Á! Nhột quá nè, nhưng mà thích lắm!", "Bắt được em rồi thì phải yêu em cả đời đó nha!", "Đừng chọc nữa, hôn một cái đi!"
Ví dụ lãng mạn: "Kể từ 14/03/2025, mỗi nhịp tim của anh đều đập vì em.", "Yêu là khi nhìn thấy nhau mỗi ngày mà vẫn thấy nhớ."
`;

export const generateLoveWish = async (context: string): Promise<LoveMessage> => {
  if (!process.env.API_KEY) {
    // Fallback if no API key is present
    const fallbacks: LoveMessage[] = [
      { text: "Tình yêu không phải là tìm thấy một người hoàn hảo, mà là nhìn thấy một người không hoàn hảo một cách hoàn hảo.", mood: 'deep' },
      { text: "Mỗi ngày bên em đều là một ngày Valentine.", mood: 'romantic' },
      { text: "Á! Đừng chạm vào em, em ngại đó... đùa thôi, chạm tiếp đi!", mood: 'funny' },
      { text: "Cảm ơn vì đã đến và làm thế giới của anh rực rỡ hơn.", mood: 'romantic' },
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Ngữ cảnh: ${context}. Hãy nói một câu thật hay.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.9, // High creativity for playfulness
      }
    });

    const text = response.text?.trim() || "Yêu là khi nhìn thấy nhau mỗi ngày mà vẫn thấy nhớ.";
    return {
      text,
      mood: 'romantic'
    };
  } catch (error) {
    console.error("Error generating love wish:", error);
    return {
      text: "Trái tim anh đập sai nhịp mỗi khi thấy nụ cười của em.",
      mood: 'romantic'
    };
  }
};

// Collection of best love quotes selected by AI
const LOVE_QUOTES: Quote[] = [
  { text: "Yêu không phải là nhìn về nhau, mà là cùng nhau nhìn về một hướng.", author: "Antoine de Saint-Exupéry" },
  { text: "Được ai đó yêu sâu sắc sẽ mang lại cho bạn sức mạnh, trong khi yêu ai đó sâu sắc sẽ mang lại cho bạn dũng khí.", author: "Lão Tử" },
  { text: "Tình yêu không chỉ là một danh từ - nó là một động từ; nó không chỉ là cảm xúc - nó là quan tâm, chia sẻ, giúp đỡ, hy sinh.", author: "William Arthur Ward" },
  { text: "Chỉ có tình yêu mới có thể xua tan bóng tối.", author: "Martin Luther King Jr." },
  { text: "Chúng ta sinh ra là để yêu. Đó là nguyên lý của sự tồn tại và là mục đích duy nhất của nó.", author: "Benjamin Disraeli" },
  { text: "Tình yêu là trạng thái mà hạnh phúc của người khác trở nên thiết yếu đối với hạnh phúc của bạn.", author: "Robert A. Heinlein" },
  { text: "Hạnh phúc lớn nhất ở đời là niềm tin vững chắc rằng chúng ta được yêu.", author: "Victor Hugo" },
  { text: "Không có phương thuốc nào cho tình yêu ngoại trừ việc yêu nhiều hơn.", author: "Henry David Thoreau" },
  { text: "Tình yêu bao gồm một linh hồn duy nhất sống trong hai cơ thể.", author: "Aristotle" },
  { text: "Nơi nào có tình yêu, nơi đó có sự sống.", author: "Mahatma Gandhi" },
  { text: "Anh yêu em không chỉ vì em là ai, mà còn vì anh là ai khi ở bên em.", author: "Elizabeth Barrett Browning" },
  { text: "Trăm năm tình viên mãn. Bạc đầu nghĩa phu thê.", author: "Tục ngữ Việt Nam" },
  { text: "Gặp gỡ là chữ Duyên và đi qua cuộc đời nhau là Định mệnh.", author: "Khuyết danh" },
  { text: "Tình yêu giống như gió, bạn không thể nhìn thấy nhưng có thể cảm nhận được.", author: "Nicholas Sparks" },
  { text: "Mọi thứ anh làm, anh đều làm vì em.", author: "Bryan Adams" }
];

export const getRandomQuote = (): Quote => {
  return LOVE_QUOTES[Math.floor(Math.random() * LOVE_QUOTES.length)];
};