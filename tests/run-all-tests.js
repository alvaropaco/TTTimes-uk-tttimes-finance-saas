/**
 * Script de Execução de Todos os Testes
 * Executa todos os tipos de testes em sequência
 */

const { APITester } = require('./api-tests');
const { AuthenticationTester } = require('./auth-tests');
const { PerformanceTester } = require('./performance-tests');

class TestRunner {
  constructor() {
    this.overallResults = {
      totalTests: 0,
      totalPassed: 0,
      totalFailed: 0,
      suites: []
    };
  }

  log(message, color = '\x1b[0m') {
    console.log(`${color}${message}\x1b[0m`);
  }

  async runTestSuite(suiteName, testerClass) {
    this.log(`\n${'='.repeat(80)}`, '\x1b[36m');
    this.log(`EXECUTANDO SUITE: ${suiteName}`, '\x1b[36m\x1b[1m');
    this.log(`${'='.repeat(80)}`, '\x1b[36m');

    const tester = new testerClass();
    const startTime = Date.now();
    
    try {
      await tester.runAllTests();
      
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      const suiteResult = {
        name: suiteName,
        total: tester.results.total,
        passed: tester.results.passed,
        failed: tester.results.failed,
        duration,
        errors: tester.results.errors
      };

      this.overallResults.suites.push(suiteResult);
      this.overallResults.totalTests += suiteResult.total;
      this.overallResults.totalPassed += suiteResult.passed;
      this.overallResults.totalFailed += suiteResult.failed;

      return suiteResult;
    } catch (error) {
      this.log(`❌ Erro ao executar suite ${suiteName}: ${error.message}`, '\x1b[31m');
      return null;
    }
  }

  async runAllTestSuites() {
    this.log('🚀 INICIANDO EXECUÇÃO COMPLETA DOS TESTES DE API', '\x1b[32m\x1b[1m');
    this.log(`Timestamp: ${new Date().toISOString()}`, '\x1b[37m');
    
    const overallStartTime = Date.now();

    // Executar todas as suites de teste
    const testSuites = [
      { name: 'Testes Gerais de API', class: APITester },
      { name: 'Testes de Autenticação', class: AuthenticationTester },
      { name: 'Testes de Performance', class: PerformanceTester }
    ];

    for (const suite of testSuites) {
      await this.runTestSuite(suite.name, suite.class);
      
      // Pausa entre suites para evitar sobrecarga
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const overallEndTime = Date.now();
    const totalDuration = (overallEndTime - overallStartTime) / 1000;

    this.generateFinalReport(totalDuration);
  }

  generateFinalReport(totalDuration) {
    this.log('\n' + '='.repeat(80), '\x1b[33m');
    this.log('RELATÓRIO FINAL CONSOLIDADO', '\x1b[33m\x1b[1m');
    this.log('='.repeat(80), '\x1b[33m');

    // Estatísticas gerais
    const overallPassRate = this.overallResults.totalTests > 0 
      ? ((this.overallResults.totalPassed / this.overallResults.totalTests) * 100).toFixed(1)
      : 0;

    this.log(`\n📊 ESTATÍSTICAS GERAIS:`, '\x1b[36m\x1b[1m');
    this.log(`   Total de testes executados: ${this.overallResults.totalTests}`);
    this.log(`   ✅ Testes aprovados: ${this.overallResults.totalPassed}`, '\x1b[32m');
    this.log(`   ❌ Testes falharam: ${this.overallResults.totalFailed}`, '\x1b[31m');
    this.log(`   📈 Taxa de aprovação geral: ${overallPassRate}%`);
    this.log(`   ⏱️  Duração total: ${totalDuration.toFixed(2)}s`);

    // Relatório por suite
    this.log(`\n📋 RELATÓRIO POR SUITE:`, '\x1b[36m\x1b[1m');
    this.overallResults.suites.forEach((suite, index) => {
      const suitePassRate = suite.total > 0 
        ? ((suite.passed / suite.total) * 100).toFixed(1)
        : 0;
      
      const statusIcon = suite.failed === 0 ? '✅' : '⚠️';
      
      this.log(`\n   ${index + 1}. ${statusIcon} ${suite.name}`);
      this.log(`      Testes: ${suite.passed}/${suite.total} (${suitePassRate}%)`);
      this.log(`      Duração: ${suite.duration.toFixed(2)}s`);
      
      if (suite.failed > 0) {
        this.log(`      ❌ Falhas: ${suite.failed}`, '\x1b[31m');
      }
    });

    // Erros detalhados
    const allErrors = this.overallResults.suites.flatMap(suite => 
      suite.errors.map(error => ({ suite: suite.name, ...error }))
    );

    if (allErrors.length > 0) {
      this.log(`\n🔍 ERROS DETALHADOS:`, '\x1b[31m\x1b[1m');
      allErrors.forEach((error, index) => {
        this.log(`\n   ${index + 1}. [${error.suite}] ${error.test}`, '\x1b[31m');
        this.log(`      Erro: ${error.error}`, '\x1b[37m');
      });
    }

    // Recomendações
    this.generateRecommendations();

    // Status final
    this.log('\n' + '='.repeat(80), '\x1b[33m');
    if (this.overallResults.totalFailed === 0) {
      this.log('🎉 TODOS OS TESTES PASSARAM! SISTEMA ESTÁ FUNCIONANDO CORRETAMENTE! 🎉', '\x1b[32m\x1b[1m');
    } else if (overallPassRate >= 80) {
      this.log('⚠️  ALGUNS TESTES FALHARAM, MAS O SISTEMA ESTÁ MAJORITARIAMENTE FUNCIONAL', '\x1b[33m\x1b[1m');
    } else {
      this.log('❌ MUITOS TESTES FALHARAM. REVISÃO NECESSÁRIA ANTES DE PRODUÇÃO', '\x1b[31m\x1b[1m');
    }
    this.log('='.repeat(80), '\x1b[33m');
  }

  generateRecommendations() {
    this.log(`\n💡 RECOMENDAÇÕES:`, '\x1b[35m\x1b[1m');

    const overallPassRate = this.overallResults.totalTests > 0 
      ? (this.overallResults.totalPassed / this.overallResults.totalTests) * 100
      : 0;

    if (overallPassRate === 100) {
      this.log('   ✨ Excelente! Todos os testes passaram. Sistema pronto para produção.');
    } else if (overallPassRate >= 90) {
      this.log('   👍 Boa taxa de aprovação. Revisar falhas menores antes do deploy.');
    } else if (overallPassRate >= 80) {
      this.log('   ⚠️  Taxa de aprovação aceitável. Investigar e corrigir falhas principais.');
    } else {
      this.log('   🚨 Taxa de aprovação baixa. Revisão completa necessária.');
    }

    // Recomendações específicas baseadas nos erros
    const authErrors = this.overallResults.suites.find(s => s.name.includes('Autenticação'))?.failed || 0;
    const perfErrors = this.overallResults.suites.find(s => s.name.includes('Performance'))?.failed || 0;

    if (authErrors > 0) {
      this.log('   🔐 Revisar implementação de autenticação e validação de tokens.');
    }

    if (perfErrors > 0) {
      this.log('   ⚡ Otimizar performance da API e considerar implementar cache.');
    }

    this.log('   📝 Executar testes regularmente durante o desenvolvimento.');
    this.log('   🔄 Considerar implementar CI/CD com execução automática de testes.');
  }
}

// Executar todos os testes se o arquivo for executado diretamente
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAllTestSuites().catch(error => {
    console.error('❌ Erro fatal na execução dos testes:', error);
    process.exit(1);
  });
}

module.exports = { TestRunner };