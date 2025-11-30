import supaBase from "./config.js";

// --- 1. DOM ELEMENTS ---
const questionForm = document.getElementById('question-form');
const questionTypeSelect = document.getElementById('question-type');
const optionsSection = document.getElementById('options-section');
const optionsList = document.getElementById('options-list');
const addOptionBtn = document.getElementById('add-opt-btn');

// --- 2. QUESTION TYPE CHANGE ---
questionTypeSelect.addEventListener('change', (e) => {
    const type = e.target.value;
    if (type === 'Data') {
        optionsSection.style.display = 'none';
    } else {
        optionsSection.style.display = 'block';
    }
});

// --- 3. ADD OPTION FUNCTION ---
addOptionBtn.addEventListener('click', () => {
    const newRow = document.createElement('div');
    newRow.className = 'input-group mb-2 option-row';
    
    // CHANGE: Neche input se 'required' hata diya hai
    newRow.innerHTML = `
        <div class="input-group-text">
            <input class="form-check-input mt-0 correct-answer-radio" type="radio" name="correct_answer">
        </div>
        <input type="text" class="form-control" placeholder="New Option"> <button type="button" class="btn btn-outline-danger remove-option-btn">Delete</button>
    `;
    optionsList.appendChild(newRow);
});

// ... (Beech ka code same rahega) ...

// --- Form Reset Logic (Submit k end mein) ---
// Yahan bhi 'required' hata den
optionsList.innerHTML = `
        <div class="input-group mb-2 option-row">
        <div class="input-group-text">
            <input class="form-check-input mt-0 correct-answer-radio" type="radio" name="correct_answer">
        </div>
        <input type="text" class="form-control" placeholder="Option 1"> <button type="button" class="btn btn-outline-danger remove-option-btn">Delete</button>
    </div>
`;

// --- 4. REMOVE OPTION ---
optionsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-option-btn')) {
        const row = e.target.closest('.option-row');
        if (optionsList.children.length > 1) {
            row.remove();
        } else {
            alert("At least one option is required!");
        }
    }
});

// --- 5. FORM SUBMISSION (ERROR FIXED HERE) ---
questionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // --- A. DATA COLLECTION ---
    const questionText = document.getElementById('en-question').value;
    const type = questionTypeSelect.value;
    const isRequired = document.querySelector('input[name="is_required"]').checked;
    
    // Fail Response Logic
    const failResponseValue = document.querySelector('input[name="fail_response"]:checked').value;
    const failResponseBool = (failResponseValue === "Yes");

    let optionsArray = [];
    let correctAnswerText = null;

    // --- B. OPTIONS HANDLING ---
    if (type !== 'Data') {
        const optionRows = document.querySelectorAll('.option-row');

        optionRows.forEach(row => {
            // FIX: '.option-text' ki jagah hum 'input[type="text"]' use kar rahy hain
            // Ta ke wo apki HTML wali input ko bhi pakar le
            const textInput = row.querySelector('input[type="text"]'); 
            const radioInput = row.querySelector('input[type="radio"]');

            if (textInput && textInput.value.trim() !== "") {
                const val = textInput.value.trim();
                optionsArray.push(val); 
                
                if (radioInput.checked) {
                    correctAnswerText = val;
                }
            }
        });

        // Validation
        if (optionsArray.length === 0) {
            alert("Please add at least one option!");
            return;
        }
        if (!correctAnswerText) {
            alert("Please select the Correct Answer (Radio button)!");
            return;
        }
    }

    // --- C. SEND TO SUPABASE ---
    try {
        const { data, error } = await supaBase
            .from('Questions') // Make sure Table Name sahi ho (Capital Q)
            .insert({
                ques_en: questionText,
                type: type,
                options_json: optionsArray,
                correct_answer_value: correctAnswerText,
                fail_response_is_yes: failResponseBool,
                is_required: isRequired
            });

        if (error) throw error;

        // --- D. SUCCESS ---
        alert("Question Saved Successfully!");
        questionForm.reset();
        
        // Reset Options UI
        optionsList.innerHTML = `
             <div class="input-group mb-2 option-row">
                <div class="input-group-text">
                    <input class="form-check-input mt-0 correct-answer-radio" type="radio" name="correct_answer">
                </div>
                <input type="text" class="form-control" placeholder="Option 1" required>
                <button type="button" class="btn btn-outline-danger remove-option-btn">Delete</button>
            </div>
        `;
        
        if (type === 'Data') {
            optionsSection.style.display = 'block'; 
        }

    } catch (err) {
        console.error("Supabase Error:", err);
        alert("Error saving: " + err.message);
    }
});