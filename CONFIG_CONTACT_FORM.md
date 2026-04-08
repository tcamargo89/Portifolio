# Configuração do Formulário de Contato

Este documento explica como configurar o envio de emails do formulário de contato para seu email **thhhiagocj@gmail.com**.

## Configuração do EmailJS (Gratuito)

1. **Criar conta no EmailJS**
   - Acesse: https://www.emailjs.com/
   - Clique em "Sign Up" e crie sua conta gratuita

2. **Conectar seu serviço de email**
   - No dashboard, clique em "Add Service"
   - Escolha seu provedor de email (Gmail recomendado)
   - Siga as instruções para conectar sua conta thhhiagocj@gmail.com
   - Anote o **Service ID** gerado (ex: `service_xxx...`)

3. **Criar template de email**
   - Clique em "Email Templates" → "Add Template"
   - Dê um nome (ex: "Contato Portfolio")
   - No corpo do email, use estas variáveis:
   ```html
   <h3>Nova mensagem do portfolio</h3>
   <p><strong>Nome:</strong> {{name}}</p>
   <p><strong>Email:</strong> {{email}}</p>
   <p><strong>Mensagem:</strong></p>
   <p>{{message}}</p>
   ```
   - **Importante**: Defina o email de destino como **thhhiagocj@gmail.com**
   - Anote o **Template ID** (ex: `template_xxx...`)

4. **Obter seu User ID**
   - No menu esquerdo, clique em "Account"
   - Copie seu **Public Key / User ID**

## Editar o código

Abra o arquivo `scripts.js` e substitua as constantes:

```javascript
const EMAILJS_SERVICE_ID = 'SEU_SERVICE_ID_AQUI'; // Substitua
const EMAILJS_TEMPLATE_ID = 'SEU_TEMPLATE_ID_AQUI'; // Substitua
const EMAILJS_USER_ID = 'SEU_USER_ID_AQUI'; // Substitua
```

## Testar

1. Abra `index.html` no browser
2. Preencha o formulário de contato
3. Verifique se o email chega em thhhiagocj@gmail.com
4. Abra o console do browser (F12) para ver logs

## Troubleshooting

- **Email não chega**: Verifique se o Service ID e Template ID estão corretos
- **Erro 403**: Verifique se o serviço de email está conectado corretamente no EmailJS
- **Erro no console**: Verifique se o User ID está correto

## Alternativas

Se preferir usar outro serviço:
- Formspree (formulário simples)
- Netlify Forms (se hospedar no Netlify)
- Backend próprio (Node.js/PHP/Python)
