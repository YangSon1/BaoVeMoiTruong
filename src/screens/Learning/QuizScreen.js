import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Button, ScrollView } from 'react-native';
import { QUIZ_QUESTIONS } from '../../data/learningData';
import { useGamification } from '../../store/GamificationContext';

export default function QuizScreen({ navigation }) {
  const { earnPoints } = useGamification();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (selectedIndex) => {
    const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
    
    let newScore = score;
    if (selectedIndex === currentQuestion.correctIndex) {
      newScore = score + 1;
      setScore(newScore); // Cộng điểm tạm thời nếu đúng
    }

    // Chuyển sang câu tiếp theo
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz(newScore);
    }
  };

  const finishQuiz = async (finalScore) => {
    setIsFinished(true);
    const totalQuestions = QUIZ_QUESTIONS.length;
    
    // Logic: Phải trả lời đúng 100% mới được cộng điểm (hoặc tùy bạn chỉnh > 50%)
    if (finalScore === totalQuestions) {
      if (earnPoints) {
        await earnPoints('COMPLETE_QUIZ');
      }
      Alert.alert("Xuất sắc! 🏆", `Bạn trả lời đúng toàn bộ ${finalScore}/${totalQuestions} câu.\nBạn nhận được +30 điểm!`);
    } else {
      Alert.alert("Kết quả", `Bạn trả lời đúng ${finalScore}/${totalQuestions} câu.\nHãy cố gắng đúng hết để nhận điểm nhé!`);
    }
  };

  const resetQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setIsFinished(false);
  };

  // --- GIAO DIỆN KẾT THÚC ---
  if (isFinished) {
    return (
      <View style={styles.container}>
        <Text style={styles.finishTitle}>🏁 Kết Thúc!</Text>
        <Text style={styles.scoreText}>Điểm số: {score}/{QUIZ_QUESTIONS.length}</Text>
        
        <TouchableOpacity style={styles.btnRetry} onPress={resetQuiz}>
          <Text style={styles.btnText}>🔄 Làm lại</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.btnBack} onPress={() => navigation.goBack()}>
          <Text style={[styles.btnText, {color: '#555'}]}>Về trang chủ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- GIAO DIỆN CÂU HỎI ---
  const question = QUIZ_QUESTIONS[currentQuestionIndex];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Thử thách kiến thức Xanh</Text>
      
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Câu hỏi {currentQuestionIndex + 1} / {QUIZ_QUESTIONS.length}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }]} />
        </View>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.questionText}>{question.question}</Text>
      </View>

      {question.options.map((option, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.optionButton} 
          onPress={() => handleAnswer(index)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5', justifyContent: 'center' },
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#2E7D32' },
  
  progressContainer: { marginBottom: 20 },
  progressText: { textAlign: 'center', marginBottom: 5, color: '#666' },
  progressBar: { height: 8, backgroundColor: '#ddd', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#4CAF50' },

  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 20, elevation: 3 },
  questionText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#333' },
  
  optionButton: {
    backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12,
    borderWidth: 1, borderColor: '#ddd', elevation: 1
  },
  optionText: { fontSize: 16, textAlign: 'center', color: '#444' },

  finishTitle: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#2E7D32' },
  scoreText: { fontSize: 20, textAlign: 'center', marginBottom: 30, color: '#333' },
  btnRetry: { backgroundColor: '#2E7D32', padding: 15, borderRadius: 8, marginBottom: 15 },
  btnBack: { backgroundColor: '#ddd', padding: 15, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 16 }
});