export const extractJSON = (text: string): string => {
  // Check if string contains markdown wrapped json block
  const markdownRegex = /```json\s*([\s\S]*?)\s*```/;
  const match = text.match(markdownRegex);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // Alternatively search for boundaries of the first '{' and the last '}'
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  
  if (start !== -1 && end !== -1 && end > start) {
    return text.substring(start, end + 1).trim();
  }

  return text.trim();
};

export default extractJSON;
