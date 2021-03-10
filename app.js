const minHealth = 0;
const maxHealth = 100;
const minDamagePlayer = 8;
const maxDamagePlayer = 15;
const minDamageMonster = 5;
const maxDamageMonster = 12;
const minSpecialDamage = 10;
const maxSpecialDamage = 25;
const minHealPlayer = 8;
const maxHealPlayer = 20;
const roundForSpecialAttack = 3;

function damageOrHeal(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      roundStreak: 0,
      isSpecialAttackAvailable: false,
      playerHealth: maxHealth,
      monsterHealth: maxHealth,
      winner: 'none',
      logTexts: []
    };
  },

  methods: {
    newGame() {
      this.roundStreak = 0;
      this.isSpecialAttackAvailable = false;
      this.playerHealth = maxHealth;
      this.monsterHealth = maxHealth;
      this.winner = 'none';
      this.logTexts = [];
    },

    attackPlayer() {
      let value = damageOrHeal(minDamagePlayer, maxDamagePlayer);
      this.playerHealth -= value;
      this.addLogText('monster', 'attack', value);
    },

    attackMonster() {
      this.roundStreak++;
      let value = damageOrHeal(minDamageMonster, maxDamageMonster);
      this.monsterHealth -= value;
      this.addLogText('player', 'attack', value);
      this.attackPlayer();
      this.specialAttackButton();
    },

    specialAttackButton() {
      if (this.roundStreak >= roundForSpecialAttack && this.roundStreak % roundForSpecialAttack === 0) {
        this.isSpecialAttackAvailable = true;
      }
    },

    specialAttack() {
      let value = damageOrHeal(minSpecialDamage, maxSpecialDamage);
      this.monsterHealth -= value;
      this.addLogText('player', 'attack', value);
      this.attackPlayer();
      this.roundStreak = 0;
      this.isSpecialAttackAvailable = false;
    },

    healPlayer() {
      this.roundStreak++;
      let value = damageOrHeal(minHealPlayer, maxHealPlayer);
      this.playerHealth += value;
      this.addLogText('player', 'heal', value);
      this.attackPlayer();
      this.specialAttackButton();
    },

    keepItReal(health) {
      health = Math.max(minHealth, health);
      health = Math.min(health, maxHealth);
      return health;
    },

    checkWinner() {
      if (this.playerHealth <= 0 && this.monsterHealth <= 0) {
        this.winner = 'draw';
      }
      else if (this.playerHealth <= 0) {
        this.winner = 'monster';
      }
      else if (this.monsterHealth <= 0) {
        this.winner = 'player';
      }
    },

    surrender() {
      this.winner = 'monster';
    },

    addLogText(who, what, value) {
      this.logTexts.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    }
  },

  computed: {
    playerHealthBarStyle() {
      return { width: this.playerHealth + '%' };
    },

    monsterHealthBarStyle() {
      return { width: this.monsterHealth + '%' };
    },
  },

  watch: {
    playerHealth() {
      this.playerHealth = this.keepItReal(this.playerHealth);
      this.checkWinner();
    },

    monsterHealth() {
      this.monsterHealth = this.keepItReal(this.monsterHealth);
      this.checkWinner();
    }
  }
});

app.mount('#game');