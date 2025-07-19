/**
 * Teardown Global dos Testes
 * Encerra o servidor Next.js após a execução dos testes
 */

module.exports = async () => {
  console.log('\n' + '='.repeat(60));
  console.log('🧹 LIMPEZA GLOBAL DOS TESTES');
  console.log('='.repeat(60));
  
  const serverManager = global.__SERVER_MANAGER__;
  
  if (serverManager) {
    try {
      await serverManager.stopServer();
      console.log('✅ Limpeza concluída com sucesso!');
    } catch (error) {
      console.error('⚠️ Erro durante a limpeza:', error);
    }
  } else {
    console.log('ℹ️ Nenhum servidor para encerrar.');
  }
  
  console.log('='.repeat(60) + '\n');
};