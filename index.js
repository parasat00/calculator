const { createApp } = Vue;

createApp({
 data() {
  return {
   output: '',
   input: '',
   num: '',
   dot: false,
   temp_output: ''
  }
 },
 methods: {
  temp_output_toggle() {
   last = this.input.charAt(this.input.length-1);

   if(!!this.input.match("[+-/*]") && !"*/+-".includes(last)) {
    this.temp_output = eval(this.input);
   }
   else {
    this.temp_output = '';
   }
  },
  clear() {
   this.output = '';
   this.input = '';
   this.temp_output = '';
   this.num = '';
  },
  type(e) {
   val = e.target.dataset.val;
   if(this.num.length < 15) {
    this.num += val;
    this.output += val;
    this.input += val;
   }
   this.temp_output_toggle();
  },
  typeOperation(e) {
   if(!this.input) { return }

   val = e.target.dataset.val;

   last = this.input.charAt(this.input.length-1);

   if("*/+-".includes(last)) {
    this.input = this.input.slice(0, -1);
    this.output = this.output.slice(0, -30);
   }

   this.output += this.num.length === 15 ? ' ' : '';

   if(val === '*') {
    this.output += `<span class="special">×</span>`;
   }
   else if(val === '/') {
    this.output += `<span class="special">÷</span>`;
   }
   else {
    this.output += `<span class="special">${val}</span>`;
   }
   
   this.num = '';

   this.input += val;

   this.temp_output_toggle();
  },
  backspace() {
   last = this.input.charAt(this.input.length-1);

   if(!"*/+-".includes(last)) {
    this.input = this.input.slice(0, -1);
    this.output = this.output.slice(0, -1);
    this.num = this.num.slice(0, -1);
   }
   else {
    this.input = this.input.slice(0, -1);
    this.output = this.input.charAt(this.input.length-31) === ' ' ? this.output.slice(0, -31) : this.output.slice(0, -30);

    if(!!this.input.match("[+-/*]")) {
     reverse_input=this.input.split("").reverse().join("");
     begging = reverse_input.match("[+-/*]").index;
     this.num = this.input.slice(-begging);
    }
    else {
     this.num = this.input;
    }
   }
   this.temp_output_toggle();
  },
  equal() {
   if(!this.temp_output) { return }

   this.output = this.temp_output + '';
   this.input = this.temp_output + '';
   this.num = this.temp_output + '';
   this.temp_output = '';
  }
 }
}).mount('#calc');