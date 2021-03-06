## 🚀 Como funciona

O servidor plota números aleatórios de velocidade e por meio de um método *GET* é possível obter a leitura desses valores.

## :arrow_forward: Instalação

Para instalar a biblioteca python necessárias, execute:
```bash
pip install opcua
```
Para instalar as bibliotecas javascript, execute:
```bash
yarn
```

## 🧪 Uso

Execute o servidor OPCUA:
```bash
python server.py
```

Execute o servidor HTTP:
```
yarn dev
```

## ✨ Rotas

É possível acessar as seguintes rotas no Postman, Insomnia ou navegador:
- `/readData` retorna um objeto com as leituras de velocidade e temperatura
- `/speed` retorna um array com as leituras de velocidade
- `/temperature` retorna um array com as leituras de temperatura

