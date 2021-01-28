((typescript-mode
  (typescript-backend . lsp)
  . (
     ;; Enable typescript-language-server and eslint LSP clients.

     (lsp-enabled-clients . (ts-ls eslint))
     (eval . (let ((project-directory (car (dir-locals-find-file "."))))
               (set (make-local-variable 'flycheck-javascript-eslint-executable)
                    (concat project-directory ".yarn/sdks/eslint/bin/eslint.js"))

              (lsp-dependency 'typescript-language-server
                              `(:system ,(concat project-directory ".yarn/sdks/typescript-language-server/lib/cli.js")))
              (lsp-dependency 'typescript
                              `(:system ,(concat project-directory ".yarn/sdks/typescript/bin/tsserver")))


               )))))
