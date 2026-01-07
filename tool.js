/* ===============================
   THEME TOGGLE
=============================== */
function toggleTheme() {
  document.body.classList.toggle("dark");
}

/* ===============================
   CENTRAL CODE ANALYSER
=============================== */
function analyseCode(code) {
  return {
    hasIf: code.includes("if"),
    hasLoop: code.includes("for") || code.includes("while"),
    hasPrint:
      code.includes("print") ||
      code.includes("printf") ||
      code.includes("System.out"),
    hasAssignment: code.includes("=") && !code.includes("==")
  };
}

/* ===============================
   VARIABLE EXTRACTOR
=============================== */
function extractVariables(code) {
  const lines = code.split("\n");
  const vars = [];

  lines.forEach(line => {
    const l = line.trim();
    if (
      l.includes("=") &&
      !l.includes("==") &&
      !l.startsWith("if") &&
      !l.startsWith("for") &&
      !l.startsWith("while") &&
      !l.startsWith("#")
    ) {
      const parts = l.split("=");
      const name = parts[0].trim();
      const value = parts.slice(1).join("=").trim();
      vars.push({ name, value });
    }
  });

  return vars;
}

/* ===============================
   GENERATE REAL-WORLD STORY
=============================== */
function generateStory() {
  const code = document.getElementById("codeInput").value.trim();
  const lang = document.getElementById("langSelect").value;

  if (!code) return alert("Please enter some code");

  const a = analyseCode(code);
  const vars = extractVariables(code);

  let story = "";
  let difficulty = "Easy";

  // Difficulty
  if (a.hasIf && a.hasLoop) difficulty = "Hard";
  else if (a.hasIf || a.hasLoop) difficulty = "Medium";

  // Variable-based story
  if (vars.length > 0) {
    if (lang === "english") {
      story += "The program stores information such as ";
      story += vars.map(v => `${v.value} in the variable ${v.name}`).join(", ");
      story += ". ";
    } else {
      story += "இந்த நிரல் ";
      story += vars.map(v => `${v.name} மாறியில் ${v.value} என்ற மதிப்பை`).join(", ");
      story += " சேமிக்கிறது. ";
    }
  }

  // If condition
  if (a.hasIf) {
    story += lang === "english"
      ? "It checks a condition before taking a decision. "
      : "முடிவு எடுப்பதற்கு முன் ஒரு நிபந்தனையை சரிபார்க்கிறது. ";
  }

  // Loop
  if (a.hasLoop) {
    story += lang === "english"
      ? "It repeats certain actions multiple times. "
      : "சில செயல்களை பலமுறை மீண்டும் செய்கிறது. ";
  }

  // Print
  if (a.hasPrint) {
    story += lang === "english"
      ? "Finally, the output is displayed to the user."
      : "இறுதியாக, வெளியீடு பயனருக்கு காட்டப்படுகிறது.";
  }

  document.getElementById("storyOutput").innerText = story;
  document.getElementById("difficulty").innerText = difficulty;
}

/* ===============================
   LINE-BY-LINE EXPLANATION
=============================== */
function lineByLine() {
  const code = document.getElementById("codeInput").value.trim();
  const lang = document.getElementById("langSelect").value;

  if (!code) return alert("Please enter some code");

  const lines = code.split("\n");
  let result = "";

  lines.forEach((line, i) => {
    const l = line.trim();
    if (!l) return;

    if (l.startsWith("#")) {
      result += lang === "english"
        ? `Line ${i + 1}: This is a comment explaining the program.\n`
        : `வரி ${i + 1}: இது நிரலின் விளக்கக் குறிப்பு.\n`;
    }
    else if (l.includes("=") && !l.includes("==")) {
      result += lang === "english"
        ? `Line ${i + 1}: A value is stored in a variable.\n`
        : `வரி ${i + 1}: ஒரு மதிப்பு மாறியில் சேமிக்கப்படுகிறது.\n`;
    }
    else if (
      l.includes("print") ||
      l.includes("printf") ||
      l.includes("System.out")
    ) {
      result += lang === "english"
        ? `Line ${i + 1}: The output is displayed to the user.\n`
        : `வரி ${i + 1}: வெளியீடு பயனருக்கு காட்டப்படுகிறது.\n`;
    }
    else if (l.startsWith("if")) {
      result += lang === "english"
        ? `Line ${i + 1}: A condition is checked to make a decision.\n`
        : `வரி ${i + 1}: முடிவு எடுக்க நிபந்தனை சரிபார்க்கப்படுகிறது.\n`;
    }
    else if (l.startsWith("for") || l.startsWith("while")) {
      result += lang === "english"
        ? `Line ${i + 1}: A loop is used to repeat actions.\n`
        : `வரி ${i + 1}: செயல் மீண்டும் மீண்டும் செய்யப்படுகிறது.\n`;
    }
    else {
      result += lang === "english"
        ? `Line ${i + 1}: This line is part of the program logic.\n`
        : `வரி ${i + 1}: இந்த வரி நிரலின் ஒரு பகுதியாகும்.\n`;
    }
  });

  document.getElementById("lineOutput").innerText = result;
}

/* ===============================
   VOICE OUTPUT
=============================== */
function speakStory() {
  const text = document.getElementById("storyOutput").innerText;
  if (!text) return alert("No story to read");

  const speech = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(speech);
}

/* ===============================
   PDF DOWNLOAD (FIXED FORMAT)
=============================== */
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10;
  const pageWidth = 180;

  // Title
  doc.setFontSize(14);
  doc.text("Code Explanation", 10, y);
  y += 10;

  // Story
  doc.setFontSize(11);
  doc.text("Real-World Story:", 10, y);
  y += 6;

  const storyText = doc.splitTextToSize(
    document.getElementById("storyOutput").innerText,
    pageWidth
  );
  doc.text(storyText, 10, y);
  y += storyText.length * 6 + 6;

  // Line-by-line
  doc.text("Line-by-Line Explanation:", 10, y);
  y += 6;

  const lineText = doc.splitTextToSize(
    document.getElementById("lineOutput").innerText,
    pageWidth
  );
  doc.text(lineText, 10, y);
  y += lineText.length * 6 + 6;

  // Difficulty
  doc.text(
    "Difficulty Level: " +
      document.getElementById("difficulty").innerText,
    10,
    y
  );

  doc.save("Code_Story_Explanation.pdf");
}
