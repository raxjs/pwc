name: "Bug Report"
description: "If something isn't working as expected."
title: "[BUG] <title>"
labels: ["Bug"]
body:
  - type: markdown
    attributes:
      value: Thanks for taking the time to file a bug report! ❤️ Please fill out this form to describe your issue.

  - type: checkboxes
    id: input1
    attributes:
      label: "⌨️"
      options:
        - label: Would you like to work on a fix?

  - type: dropdown
    attributes:
      label: Where is the bug from?
      options:
        - PWC Core
        - PWC Compiler
        - I don't know
    validations:
      required: true

  - type: textarea
    attributes:
      label: Minimal code and steps to reproduce the bug
      description: |
        To help fixing the bug sooner, you should provide the minimal code and steps necessary to reproduce the bug.
        If it's not possible to reproduce the bug with simple code, a GitHub repository link is also ok.
      placeholder: |
        ```js
        const your => (code) => here;
        ```
        1. In this environment...
        2. With this config...
        3. Run '...'
        4. See error...
    validations:
      required: true

  - type: textarea
    attributes:
      label: Current and expected behavior
      description: A clear and concise description of what it happens and what you would expect.
    validations:
      required: true

  - type: textarea
    attributes:
      label: Environment
      placeholder: |
        - OS: [e.g. macOS 10.15.4, Windows 10, iOS]
        - PWC version: [e.g. 1.0.0]
        - Node: [e.g. Node 15]
        - Browser: [e.g. chrome, safari]
    validations:
      required: true

  - type: textarea
    attributes:
      label: Possible solution
      description: "If you have any suggestion on a fix for the bug."

  - type: textarea
    attributes:
      label: Additional context
      description: "Add any other context about the problem here. Or a screenshot if applicable."
