// admin.js (Complete, Final, Error-Free Code)

// Supabase client ko import karen
import supaBase from "./config.js"; 

// Variable to keep track of the number of options for unique names
let optionCount = 1;

// --- FUNCTION DEFINITIONS (These need to be in the global scope of the module) ---

function toggleOptions(questionType) {
    const optionsSection = document.getElementById('options-section');
    const isDataCheckbox = document.querySelector('input[name="is_data"]');
    
    // Reset Data checkbox state
    isDataCheckbox.checked = false;
    isDataCheckbox.disabled = true;

    if (questionType === 'Multiple') {
        optionsSection.style.display = 'block';
    } else if (questionType === 'Data') {
        optionsSection.style.display = 'none';
        isDataCheckbox.checked = true;
    } else {
        optionsSection.style.display = 'none';
    }
}

function addOption() {
    optionCount++;
    const optionsList = document.getElementById('options-list');
    
    const newOptionRow = document.createElement('div');
    newOptionRow.classList.add('input-group', 'mb-2', 'option-row');
    
    newOptionRow.innerHTML = `
        <div class="input-group-text">
            <input class="form-check-input mt-0 correct-answer-radio" type="radio" name="correct_answer" value="${optionCount}" aria-label="Radio button for correct answer">
        </div>
        <input type="text" class="form-control" placeholder="EN Option ${optionCount}" name="en_option_${optionCount}" required>
        <input type="text" class="form-control" placeholder="FR Option ${optionCount}" name="fr_option_${optionCount}"> 
        <button type="button" class="btn btn-outline-danger remove-option-btn" onclick="removeOption(this)">X</button>
    `;
    
    optionsList.appendChild(newOptionRow);
}

function removeOption(button) {
    const optionsList = document.getElementById('options-list');
    if (optionsList.childElementCount > 1) {
        button.closest('.option-row').remove();
    } else {
        alert("You must have at least one option.");
    }
}

// --- DOM CONTENT LOADED AND SUBMIT HANDLER (Data Insertion Logic) ---

document.addEventListener('DOMContentLoaded', () => {
    const questionTypeSelect = document.getElementById('question-type');
    
    // 1. FIX: Initial call to set the correct state on load
    toggleOptions(questionTypeSelect.value);
    
    // 2. FIX: Naya change listener jo error theek karega (onchange ki jagah)
    questionTypeSelect.addEventListener('change', function() {
        toggleOptions(this.value);
    });
    
    // SUBMIT HANDLER: Yahan data database mein save hota hai
    document.getElementById('question-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // 1. Validation check
        if (data.type === 'Multiple' && !data.correct_answer) {
            alert("Please select the correct answer for the Multiple choice question.");
            return;
        }

        // 2. Options ko JSON format mein tayyar karna
        let optionsArray = [];
        if (data.type === 'Multiple') {
            let currentOptionId = 1;
            while (data[`en_option_${currentOptionId}`]) {
                optionsArray.push({
                    id: currentOptionId.toString(),
                    en: data[`en_option_${currentOptionId}`],
                    fr: data[`fr_option_${currentOptionId}`] || "" 
                });
                currentOptionId++;
            }
        }

        // 3. Data ko Supabase mein insert karna
        const { data: insertedData, error } = await supaBase
            .from('Questions') 
            .insert([
                {
                    // Yeh columns ke naam hain jo aapki Supabase table mein hain:
                    question_en: data.en_question, 
                    // question_fr: data.fr_question || null, // Agar table mein ye column ho toh use karein
                    type: data.type,
                    options_json: optionsArray.length > 0 ? optionsArray : null,
                    correct_answer_value: data.correct_answer || null,
                    fail_response_is_yes: data.fail_response === 'Yes', 
                    is_required: data.is_required ? true : false,
                }
            ]);

        // 4. Result check karna
        if (error) {
            console.error('Supabase Error:', error);
            alert('❌ Sawaal save karne mein error aagaya. Console check karein.');
        } else {
            console.log("Question saved successfully:", insertedData);
            alert("✅ Sawaal kamyabi se save ho gaya!");
            form.reset(); 
            // Reset hone ke baad form ko theek state mein laane ke liye:
            toggleOptions(questionTypeSelect.value); 
        }
    });

    // Logic for "+ Add Question" button
    document.getElementById('add-question-btn').addEventListener('click', function() {
        // Logic to clear the form and prepare for a new question
        document.getElementById('question-form').reset();
        toggleOptions('Single'); // Reset to default type
        
        // Reset option count and clear dynamic options, keeping one default row
        const optionsList = document.getElementById('options-list');
        optionsList.innerHTML = `
            <div class="input-group mb-2 option-row">
                <div class="input-group-text">
                    <input class="form-check-input mt-0 correct-answer-radio" type="radio" name="correct_answer" value="1" aria-label="Radio button for correct answer">
                </div>
                <input type="text" class="form-control" placeholder="EN Option 1" name="en_option_1" required>
                <input type="text" class="form-control" placeholder="FR Option 1" name="fr_option_1"> 
                <button type="button" class="btn btn-outline-danger remove-option-btn" onclick="removeOption(this)">X</button>
            </div>
        `;
        optionCount = 1;
    });
});