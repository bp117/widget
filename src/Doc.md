Here is the complete markdown documentation including all sections in a single markdown block.

```markdown
# Widget Documentation

## Introduction

This documentation provides a comprehensive guide on the widgets developed, including:

- **Information Retrieval (IR) Widget**
- **Retriever Augmented Generation (RAG) Widget**
- **Chat Widget**

These widgets leverage canonical endpoints powered by **LangGraph** to perform tasks such as search, generate, and response refinement using tools like **Gemini**.

## Widgets Overview

### 1. Information Retrieval (IR) Widget

**Description**: The IR Widget allows users to perform high-speed searches across large datasets based on user queries. It utilizes the canonical search endpoint provided by LangGraph for efficient information retrieval.

**Endpoint Used**: `search` (LangGraph)

### 2. Retriever Augmented Generation (RAG) Widget

**Description**: The RAG Widget combines document retrieval with generative AI to produce accurate, contextually relevant responses. It uses both the search and generate capabilities of LangGraph.

**Endpoints Used**: `search`, `generate` (LangGraph)

### 3. Chat Widget

**Description**: The Chat Widget enables conversational interactions, leveraging LangGraph's search, generate, and response refinement functionalities powered by **Gemini**.

**Endpoints Used**: `search`, `generate`, `response_refine` (LangGraph + Gemini)

## Common Widget Parameters

These parameters are shared across all widgets:

| **Parameter**   | **Description**                                                      | **Type**   | **Default Value** |
|-----------------|----------------------------------------------------------------------|------------|-------------------|
| `apiUrl`        | The API endpoint URL for the widget to send requests to.             | `string`   | -                 |
| `task`          | Specifies the task type (`IR`, `RAG`, or `Chat`).                    | `string`   | -                 |
| `useCaseId`     | Unique identifier for the use case.                                  | `string`   | -                 |
| `promptId`      | Identifier for the specific prompt or query.                         | `string`   | -                 |
| `apiKey`        | API key for authenticating with the backend services.                | `string`   | -                 |
| `darkMode`      | Toggle between dark and light UI themes.                             | `boolean`  | `false`           |
| `searchQuery`   | The user's search input or query string.                             | `string`   | -                 |

## IR Widget Parameters

In addition to the common parameters, the IR Widget supports:

| **Parameter**    | **Description**                                                      | **Type**  | **Default Value** |
|------------------|----------------------------------------------------------------------|-----------|-------------------|
| `results_count`  | Number of search results to display.                                 | `int`     | `10`              |
| `use_reranker`   | Enable reranking to improve result accuracy.                         | `boolean` | `false`           |

### IR Widget Embeddable Code Example

```html
<div id="ir-widget-container"></div>
<script>
  IRWidget("ir-widget-container", {
    apiUrl: "https://api.yourdomain.com/search",
    task: "IR",
    useCaseId: "your-usecase-id",
    promptId: "your-prompt-id",
    apiKey: "your-api-key",
    darkMode: true,
    results_count: 10,
    use_reranker: false,
    searchQuery: "Your search query here"
  });
</script>
```

## RAG Widget Parameters

In addition to the common parameters, the RAG Widget supports:

| **Parameter**            | **Description**                                                     | **Type**   | **Default Value** |
|--------------------------|---------------------------------------------------------------------|------------|-------------------|
| `results_count`          | Number of documents to retrieve before generation.                  | `int`      | `5`               |
| `use_reranker`           | Enable reranking to improve document selection.                     | `boolean`  | `false`           |
| `rag_prompt_template`    | Template used for generating responses.                             | `string`   | -                 |
| `response_format`        | Format of the generated response (`text`, `html`, `markdown`).      | `string`   | `text`            |

### RAG Widget Embeddable Code Example

```html
<div id="rag-widget-container"></div>
<script>
  RAGWidget("rag-widget-container", {
    apiUrl: "https://api.yourdomain.com/search_generate",
    task: "RAG",
    useCaseId: "your-usecase-id",
    promptId: "your-prompt-id",
    apiKey: "your-api-key",
    darkMode: true,
    results_count: 5,
    rag_prompt_template: "Your prompt template here",
    response_format: "markdown",
    searchQuery: "Your search query here"
  });
</script>
```

## Chat Widget Parameters

In addition to the common parameters, the Chat Widget supports:

| **Parameter**      | **Description**                                                         | **Type**   | **Default Value**  |
|--------------------|-------------------------------------------------------------------------|------------|--------------------|
| `conversationId`   | Identifier for the conversation thread.                                 | `string`   | Auto-generated     |
| `enableRefinement` | Enable response refinement using Gemini.                                | `boolean`  | `true`             |
| `initialPrompt`    | Initial message or greeting displayed to the user.                      | `string`   | -                  |

### Chat Widget Embeddable Code Example

```html
<div id="chat-widget-container"></div>
<script>
  ChatWidget("chat-widget-container", {
    apiUrl: "https://api.yourdomain.com/chat",
    task: "Chat",
    useCaseId: "your-usecase-id",
    promptId: "your-prompt-id",
    apiKey: "your-api-key",
    darkMode: true,
    enableRefinement: true,
    initialPrompt: "Hello! How can I assist you today?",
  });
</script>
```

## Widget Customization

Each widget supports customization options such as enabling dark mode, adjusting the number of search results, and applying custom CSS.

## Installation and Usage

### Embedding a Widget

1. **Include the Widget Script**

   Ensure that you include the widget's JavaScript file in your HTML:

   ```html
   <script src="https://cdn.yourdomain.com/widgets.js"></script>
   ```

2. **Add the Widget Container**

   Add a `<div>` element where you want the widget to appear:

   ```html
   <div id="widget-container"></div>
   ```

3. **Initialize the Widget**

   Call the widget initialization function with the required parameters:

   ```html
   <script>
     IRWidget("widget-container", {
       apiUrl: "https://api.yourdomain.com/search",
       task: "IR",
       useCaseId: "your-usecase-id",
       promptId: "your-prompt-id",
       apiKey: "your-api-key",
       darkMode: false,
     });
   </script>
   ```

### API Authentication

- Obtain your `apiKey` from your LangGraph account.
- Keep your `apiKey` secure and do not expose it in client-side code. Consider using a proxy or server-side component to handle API requests securely.

## Conclusion

This documentation provides all the necessary information to integrate and customize the IR Widget, RAG Widget, and Chat Widget in your applications. By leveraging these widgets, you can enhance user interactions with powerful search, generation, and conversational capabilities.

For further assistance, please refer to the LangGraph API documentation or contact our support team.
```

You can now copy and paste this complete markdown into your GitHub README or other documentation files. Let me know if you'd like further assistance!
