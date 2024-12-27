/*
  The `common` bundle includes these languages:

  1. bash (shell)
  2. c
  3. cpp (c++)
  4. csharp (c#)
  5. css
  6. diff
  7. go
  8. ini
  9. java
  10. javascript (js)
  11. json
  12. kotlin 
  13. less
  14. lua
  15. makefile
  16. markdown (md)
  17. objectivec
  18. perl
  19. php
  20. php-template
  21. plaintext
  22. python (py)
  23. python-repl
  24. r
  25. ruby (rb)
  26. rust
  27. scss
  28. shell
  29. sql
  30. swift
  31. typescript (ts)
  32. xml
  33. yaml
*/

// Third party libraries
import jsx from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import { common, createLowlight } from "lowlight";

// Create lowlight instance with ALL common languages
export const lowlight = createLowlight(common);
lowlight.register("jsx", jsx);
lowlight.register("tsx", typescript);
