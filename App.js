// App.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import { db } from './firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

const App = () => {
  const [produtos, setProdutos] = useState([]);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [idProduto, setIdProduto] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'produtos'), (snapshot) => {
      const produtosList = snapshot.docs.map(doc => ({ id: doc.id, nome: doc.data().nome, preco: doc.data().preco }));
      setProdutos(produtosList);
    });

    return () => unsubscribe();
  }, []);

  const adicionarProduto = async () => {
    if (nome === '' || preco === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    await addDoc(collection(db, 'produtos'), { nome, preco: parseFloat(preco) });
    setNome('');
    setPreco('');
  };

  const alterarProduto = async (id) => {
    if (nome === '' || preco === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const produtoRef = doc(db, 'produtos', id);
    await updateDoc(produtoRef, { nome, preco: parseFloat(preco) });
    setNome('');
    setPreco('');
    setIdProduto(null);
  };

  const excluirProduto = async (id) => {
    const produtoRef = doc(db, 'produtos', id);
    await deleteDoc(produtoRef);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nome do produto"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Preço do produto"
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
      />
      <Button title={idProduto ? "Alterar" : "Adicionar"} onPress={() => idProduto ? alterarProduto(idProduto) : adicionarProduto()} />
      <ScrollView style={styles.scrollContainer}>
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.produtoContainer}>
              <View style={styles.produtoInfo}>
                <Text style={styles.produtoNome}>{item.nome}</Text>
                <Text style={styles.produtoPreco}>R$ {item.preco.toFixed(2)}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <Button title="Alterar" onPress={() => { setNome(item.nome); setPreco(item.preco.toString()); setIdProduto(item.id); }} />
                <Button title="Excluir" onPress={() => excluirProduto(item.id)} />
              </View>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  produtoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
  },
  produtoInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  produtoNome: {
    flex: 1,
    marginRight: 10,
  },
  produtoPreco: {
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default App;