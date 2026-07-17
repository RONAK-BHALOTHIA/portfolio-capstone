# WORKFLOW.md

# AI Workflow Comparison

## Feature

I built a Settings Form for my portfolio project in two different ways to compare the impact of prompt quality on AI-generated code.

## Round One – Vague Prompt

For the first attempt, I used a very simple prompt: "Create a simple settings form for my portfolio website." I provided no additional context, requirements, or constraints. The AI generated a working form, but it lacked several important features. Input validation was basic, accessibility was limited, and some edge cases, such as password confirmation and invalid email formats, were not fully handled. I had to spend extra time reviewing the code and making manual improvements.

## Round Two – Detailed Prompt

For the second attempt, I started a new AI chat and used a detailed prompt with specific requirements. I asked for required fields, email validation, password confirmation, responsive design, accessible labels, localStorage support, and a verification step to review the generated code. The AI produced a much more complete implementation. The code was better organized, easier to understand, and required fewer manual corrections.

## Comparison

The detailed prompt produced significantly better results. The generated code included stronger validation, improved accessibility, cleaner file organization, and better user experience. Although writing the prompt took a few extra minutes, the total development time was lower because I spent less time fixing issues after generation. The second workflow also made the review process easier because the AI followed the requirements more closely.

## AI Mistake I Caught

During testing, I noticed that the AI did not correctly handle one validation case in the initial implementation. I reviewed the generated code, corrected the issue, and verified that the form behaved as expected. This reinforced the importance of reviewing AI-generated code instead of accepting it without verification.

## Conclusion

This exercise showed that AI is most effective when given clear instructions, constraints, and verification requirements. A detailed prompt improves correctness, reduces review effort, and produces more maintainable code. In future projects, I will use structured prompts and always verify AI-generated output before considering a feature complete.