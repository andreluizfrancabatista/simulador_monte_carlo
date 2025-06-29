# 🎲 Simulador Monte Carlo - Apostas Esportivas

Uma aplicação web moderna e interativa para simulações de apostas esportivas com stake acumulativa, baseada em simulações de Monte Carlo.

![Demo](https://img.shields.io/badge/Status-Funcionando-brightgreen)
![Tecnologia](https://img.shields.io/badge/Tech-Vanilla_JS-yellow)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## 📋 Descrição do Projeto

Esta aplicação permite analisar o risco e os possíveis resultados de estratégias de apostas esportivas através de simulações Monte Carlo. O usuário pode configurar diversos parâmetros e visualizar estatísticas detalhadas e gráficos interativos dos resultados.

### ✨ Principais Funcionalidades

- **🎯 Simulações Personalizáveis**: Configure stake inicial, quantidade de apostas, probabilidades e taxas
- **📊 Estatísticas Detalhadas**: Análise completa com média, mediana, desvio padrão e percentis
- **📈 Gráficos Interativos**: Histograma de distribuição e evolução do capital em tempo real
- **📋 Análise Individual**: Tabela detalhada de uma simulação específica
- **🌙 Modo Escuro/Claro**: Interface adaptável com tema personalizável
- **📱 Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **⚡ Performance Otimizada**: Execução rápida mesmo com milhares de simulações

## 🚀 Como Usar a Aplicação

### Parâmetros de Entrada

1. **Stake Inicial (R$)**: Valor inicial do capital para investimento
2. **Apostas por Simulação**: Quantidade de apostas em cada simulação
3. **Número de Simulações**: Quantidade de simulações Monte Carlo a executar
4. **Chance de Perda (%)**: Probabilidade de perder uma aposta individual
5. **Taxa de Lucro (Min/Max %)**: Intervalo de retorno quando a aposta é ganha
6. **Taxa de Prejuízo (Min/Max %)**: Intervalo de perda quando a aposta é perdida

### Interpretando os Resultados

- **Estatísticas**: Analise os valores mínimo, máximo, média e mediana dos capitais finais
- **Histograma**: Visualize a distribuição dos resultados finais
- **Evolução**: Acompanhe como o capital evolui ao longo das apostas
- **Tabela Detalhada**: Examine aposta por aposta de uma simulação específica

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica moderna
- **CSS3**: Design responsivo com CSS Grid e Flexbox
- **JavaScript (ES6+)**: Lógica de simulação e manipulação DOM
- **Chart.js**: Biblioteca para gráficos interativos
- **Docker**: Containerização para fácil deployment
- **Nginx**: Servidor web para produção

## 💻 Como Executar Localmente

### Método 1: Servidor Local Simples

```bash
# Clone ou baixe os arquivos do projeto
# Navegue até o diretório do projeto

# Opção A: Usando Python (se disponível)
python -m http.server 8000

# Opção B: Usando Node.js (se disponível)
npx http-server -p 8000

# Opção C: Usando PHP (se disponível)
php -S localhost:8000
```

Acesse: `http://localhost:8000`

### Método 2: Abrir Diretamente no Navegador

Simplesmente abra o arquivo `index.html` diretamente no seu navegador. A aplicação funcionará completamente offline.

## 🐳 Executar com Docker

### Construir e Executar

```bash
# Construir a imagem Docker
docker build -t monte-carlo-simulator .

# Executar o container
docker run -d -p 8080:80 --name monte-carlo-app monte-carlo-simulator
```

Acesse: `http://localhost:8080`

### Comandos Docker Úteis

```bash
# Parar o container
docker stop monte-carlo-app

# Remover o container
docker rm monte-carlo-app

# Visualizar logs
docker logs monte-carlo-app

# Executar em modo interativo (para debug)
docker run -it -p 8080:80 monte-carlo-simulator
```

### Docker Compose (Opcional)

Crie um arquivo `docker-compose.yml`:

```yaml
version: '3.8'
services:
  monte-carlo-app:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

Execute com:
```bash
docker-compose up -d
```

## 📁 Estrutura do Projeto

```
monte-carlo-simulator/
├── index.html          # Página principal da aplicação
├── styles.css          # Estilos e tema da interface
├── script.js           # Lógica JavaScript principal
├── Dockerfile          # Configuração Docker
├── README.md           # Este arquivo de documentação
└── docker-compose.yml  # Configuração Docker Compose (opcional)
```

## 🔧 Configuração e Personalização

### Modificar Parâmetros Padrão

Edite o arquivo `script.js` na seção de inicialização:

```javascript
// Valores padrão dos inputs
this.inputs = {
    stakeInicial: { value: 100.00 },
    qtdApostas: { value: 100 },
    numSimulacoes: { value: 1000 },
    // ... outros valores
};
```

### Personalizar Temas

Modifique as variáveis CSS em `styles.css`:

```css
:root {
    --primary-color: #3b82f6;  /* Cor principal */
    --success-color: #10b981;  /* Cor de sucesso */
    --danger-color: #ef4444;   /* Cor de perigo */
    /* ... outras variáveis */
}
```

## ⚡ Performance e Limitações

- **Simulações Recomendadas**: Até 10.000 simulações para performance otimizada
- **Apostas por Simulação**: Até 1.000 apostas recomendadas
- **Gráfico de Evolução**: Limitado a 100 linhas para melhor visualização
- **Compatibilidade**: Funciona em navegadores modernos (Chrome, Firefox, Safari, Edge)

## 🐛 Solução de Problemas

### Problema: Gráficos não aparecem
**Solução**: Verifique se o Chart.js está carregando corretamente. Teste em outro navegador.

### Problema: Simulação muito lenta
**Solução**: Reduza o número de simulações ou use valores menores para testes.

### Problema: Erro no Docker
**Solução**: Verifique se a porta 8080 não está sendo usada por outro serviço.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Reportar bugs através de issues
2. Sugerir melhorias
3. Submeter pull requests
4. Melhorar a documentação

## 📄 Licença

Este projeto é open source e está disponível sob a [Licença MIT](LICENSE).

## 🎯 Próximas Melhorias

- [ ] Exportar resultados para CSV/PDF
- [ ] Análise de risco avançada (VaR, CVaR)
- [ ] Comparação entre diferentes estratégias
- [ ] Otimização de estratégias com algoritmos genéticos
- [ ] API para integração com outros sistemas
- [ ] Testes unitários automatizados

## 📞 Suporte

Para dúvidas, sugestões ou problemas:

1. Abra uma issue no repositório
2. Consulte a documentação
3. Verifique as perguntas frequentes

---

**Desenvolvido com ❤️ para análise quantitativa de apostas esportivas**

*Lembre-se: Este simulador é apenas para fins educacionais e de análise. Apostas envolvem riscos reais e devem ser feitas com responsabilidade.*