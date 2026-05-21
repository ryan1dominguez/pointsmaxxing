import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'

export default function HomeScreen() {
  const [purchase, setPurchase] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRecommend = async () => {
    setLoading(true)
    const response = await fetch('https://pointsmaxxing.vercel.app/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ purchase_description: purchase })
    })
    const data = await response.json()
    setResult(data.message)
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PointsMaxx</Text>
      <TextInput
        style={styles.input}
        placeholder="What are you buying?"
        placeholderTextColor="#888"
        value={purchase}
        onChangeText={setPurchase}
      />
      <TouchableOpacity style={styles.button} onPress={handleRecommend}>
        <Text style={styles.buttonText}>Find Best Card</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator />}
      {result ? <Text style={styles.result}>{result}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 16 },
  button: { backgroundColor: '#000', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 24 },
  buttonText: { color: '#ccc', fontSize: 16, fontWeight: 'bold' },
  result: { fontSize: 16, textAlign: 'center', lineHeight: 24 }
})