export type Language = 'en' | 'hi' | 'pa' | 'ta';

const a = {
    app_title: {
        en: 'Kisan AI',
        hi: 'किसान एआई',
        pa: 'ਕਿਸਾਨ ਏਆਈ',
        ta: 'கிசான் AI',
    },
    tab_chat: { en: 'Chat', hi: 'चैट', pa: 'ਚੈਟ', ta: 'அரட்டை' },
    tab_live: { en: 'Live Talk', hi: 'लाइव टॉक', pa: 'ਲਾਈਵ ਗੱਲਬਾਤ', ta: 'நேரலை பேச்சு' },
    tab_notes: { en: 'Notes', hi: 'नोट्स', pa: 'ਨੋਟਸ', ta: 'குறிப்புகள்' },
    
    // ChatWindow
    thinking: { en: 'Thinking', hi: 'सोच रहा हूँ', pa: 'ਸੋਚ ਰਿਹਾ ਹਾਂ', ta: 'சிந்திக்கிறேன்' },
    deep_thought: { en: 'Deep Thought', hi: 'गहरी सोच', pa: 'ਡੂੰਘੀ ਸੋਚ', ta: 'ஆழ்ந்த சிந்தனை' },
    attach_image: { en: 'Attach Image', hi: 'छवि संलग्न करें', pa: 'ਚਿੱਤਰ ਨੱਥੀ ਕਰੋ', ta: 'படத்தை இணைக்கவும்' },
    chat_placeholder: { en: 'Ask about crops, soil, or government schemes...', hi: 'फसलों, मिट्टी, या सरकारी योजनाओं के बारे में पूछें...', pa: 'ਫਸਲਾਂ, ਮਿੱਟੀ, ਜਾਂ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਬਾਰੇ ਪੁੱਛੋ...', ta: 'பயிர்கள், மண், அல்லது அரசாங்க திட்டங்கள் பற்றி கேளுங்கள்...' },
    alt_user_upload: { en: 'User upload', hi: 'उपयोगकर्ता अपलोड', pa: 'ਉਪਭੋਗਤਾ ਅੱਪਲੋਡ', ta: 'பயனர் பதிவேற்றம்' },
    alt_file_preview: { en: 'File preview', hi: 'फ़ाइल पूर्वावलोकन', pa: 'ਫਾਈਲ ਝਲਕ', ta: 'கோப்பு முன்னோட்டம்' },
    weekly_checkin: { en: "Hello! It's been a while. How are things on the farm? Feel free to share any updates or ask new questions!", hi: 'नमस्ते! काफी समय हो गया। खेत पर सब कैसा चल रहा है? कोई भी अपडेट साझा करने या नए प्रश्न पूछने में संकोच न करें!', pa: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਕਾਫ਼ੀ ਸਮਾਂ ਹੋ ਗਿਆ ਹੈ। ਖੇਤ ਵਿੱਚ ਸਭ ਕੁਝ ਕਿਵੇਂ ਹੈ? ਕੋਈ ਵੀ ਅੱਪਡੇਟ ਸਾਂਝਾ ਕਰਨ ਜਾਂ ਨਵੇਂ ਸਵਾਲ ਪੁੱਛਣ ਲਈ ਬੇਝਿਜਕ ਮਹਿਸੂਸ ਕਰੋ!', ta: 'வணக்கம்! சில காலம் ஆகிவிட்டது. பண்ணையில் எல்லாம் எப்படி இருக்கிறது? எந்தப் புதுப்பிப்புகளையும் பகிர்ந்து கொள்ள அல்லது புதிய கேள்விகளைக் கேட்க தயங்க வேண்டாம்!' },

    // LiveTalk
    connecting: { en: 'Connecting...', hi: 'कनेक्ट हो रहा है...', pa: 'ਕਨੈਕਟ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...', ta: 'இணைக்கிறது...' },
    listening: { en: 'Listening... Tap to end.', hi: 'सुन रहा हूँ... समाप्त करने के लिए टैप करें।', pa: 'ਸੁਣ ਰਿਹਾ ਹਾਂ... ਖਤਮ ਕਰਨ ਲਈ ਟੈਪ ਕਰੋ।', ta: 'கேட்கிறது... முடிக்க தட்டவும்.' },
    tap_to_start_profiling: { en: 'Tap to start profiling & ask for a farm plan', hi: 'प्रोफाइलिंग शुरू करने और फार्म योजना मांगने के लिए टैप करें', pa: 'ਪ੍ਰੋਫਾਈਲਿੰਗ ਸ਼ੁਰੂ ਕਰਨ ਅਤੇ ਫਾਰਮ ਯੋਜਨਾ ਮੰਗਣ ਲਈ ਟੈਪ ਕਰੋ', ta: 'சுயவிவரத்தைத் தொடங்கவும் & பண்ணைத் திட்டத்தைக் கேட்கவும் தட்டவும்' },
    tap_to_start_analysis: { en: 'Tap to start analysis', hi: 'विश्लेषण शुरू करने के लिए टैप करें', pa: 'ਵਿਸ਼ਲੇਸ਼ਣ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਟੈਪ ਕਰੋ', ta: 'பகுப்பாய்வைத் தொடங்க தட்டவும்' },
    live_profile_title: { en: 'Live Farm Profile', hi: 'लाइव फार्म प्रोफाइल', pa: 'ਲਾਈਵ ਫਾਰਮ ਪ੍ਰੋਫਾਈਲ', ta: 'நேரடி பண்ணை சுயவிவரம்' },
    change_media: { en: 'Change Media', hi: 'मीडिया बदलें', pa: 'ਮੀਡੀਆ ਬਦਲੋ', ta: 'மீடியாவை மாற்றவும்' },
    add_media_context: { en: 'Add Image/Video Context', hi: 'छवि/वीडियो संदर्भ जोड़ें', pa: 'ਚਿੱਤਰ/ਵੀਡੀਓ ਸੰਦਰਭ ਸ਼ਾਮਲ ਕਰੋ', ta: 'படம்/காணொளி சூழலைச் சேர்க்கவும்' },
    you_said: { en: 'You said', hi: 'आपने कहा', pa: 'ਤੁਸੀਂ ਕਿਹਾ', ta: 'நீங்கள் சொன்னீர்கள்' },
    ai_said: { en: 'AI said', hi: 'AI ने कहा', pa: 'AI ਨੇ ਕਿਹਾ', ta: 'AI சொன்னது' },
    location: { en: 'Location', hi: 'स्थान', pa: 'ਸਥਾਨ', ta: 'இடம்' },
    farmSize: { en: 'Farm Size (in acres)', hi: 'खेत का आकार (एकड़ में)', pa: 'ਖੇਤ ਦਾ ਆਕਾਰ (ਏਕੜ ਵਿੱਚ)', ta: 'பண்ணை அளவு (ஏக்கரில்)' },
    soilType: { en: 'Soil Type', hi: 'मिट्टी का प्रकार', pa: 'ਮਿੱਟੀ ਦੀ ਕਿਸਮ', ta: 'மண் வகை' },
    waterSource: { en: 'Water Source', hi: 'जल स्रोत', pa: 'ਪਾਣੀ ਦਾ ਸਰੋਤ', ta: 'நீர் ஆதாரம்' },
    currentCrops: { en: 'Current Crops', hi: 'वर्तमान फसलें', pa: 'ਮੌਜੂਦਾ ਫਸਲਾਂ', ta: 'தற்போதைய பயிர்கள்' },
    goals: { en: 'Goals', hi: 'लक्ष्य', pa: 'ਟੀਚੇ', ta: 'இலக்குகள்' },
    
    // Notes
    notes_title: { en: 'My Notes', hi: 'मेरे नोट्स', pa: 'ਮੇਰੇ ਨੋਟਸ', ta: 'எனது குறிப்புகள்' },
    clear_all_button: { en: 'Clear All', hi: 'सब साफ़ करो', pa: 'ਸਭ ਸਾਫ਼ ਕਰੋ', ta: 'அனைத்தையும் அழி' },
    no_notes_title: { en: 'No notes yet.', hi: 'अभी तक कोई नोट्स नहीं है।', pa: 'ਅਜੇ ਤੱਕ ਕੋਈ ਨੋਟਸ ਨਹੀਂ ਹੈ।', ta: 'இன்னும் குறிப்புகள் இல்லை.' },
    no_notes_subtitle: { en: 'Ask the AI in \'Live Talk\' to save something for you.', hi: '\'लाइव टॉक\' में AI से कुछ बचाने के लिए कहें।', pa: '\'ਲਾਈਵ ਗੱਲਬਾਤ\' ਵਿੱਚ AI ਨੂੰ ਤੁਹਾਡੇ ਲਈ ਕੁਝ ਬਚਾਉਣ ਲਈ ਕਹੋ।', ta: '\'நேரலை பேச்சு\' இல் AI இடம் உங்களுக்காக ஏதாவது சேமிக்கச் சொல்லுங்கள்.' },

    // Fix: Add missing translations for ImageAnalyzer
    image_analyzer_title: { en: 'Image Analyzer', hi: 'छवि विश्लेषक', pa: 'ਚਿੱਤਰ ਵਿਸ਼ਲੇਸ਼ਕ', ta: 'பட பகுப்பாய்வி' },
    image_analyzer_default_prompt: { en: 'Analyze this image of my crop. Identify any potential diseases, pests, or nutrient deficiencies. Provide recommendations.', hi: 'मेरी फसल की इस छवि का विश्लेषण करें। किसी भी संभावित बीमारियों, कीटों, या पोषक तत्वों की कमी को पहचानें। सिफारिशें प्रदान करें।', pa: 'ਮੇਰੀ ਫਸਲ ਦੀ ਇਸ ਤਸਵੀਰ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ। ਕਿਸੇ ਵੀ ਸੰਭਾਵੀ ਬਿਮਾਰੀਆਂ, ਕੀੜਿਆਂ, ਜਾਂ ਪੌਸ਼ਟਿਕ ਤੱਤਾਂ ਦੀ ਕਮੀ ਦੀ ਪਛਾਣ ਕਰੋ। ਸਿਫ਼ਾਰਸ਼ਾਂ ਪ੍ਰਦਾਨ ਕਰੋ।', ta: 'எனது பயிரின் இந்தப் படத்தை பகுப்பாய்வு செய்யுங்கள். ஏதேனும் நோய்கள், பூச்சிகள் அல்லது ஊட்டச்சத்துக் குறைபாடுகளைக் கண்டறியவும். பரிந்துரைகளை வழங்கவும்.' },
    alt_upload_preview: { en: 'Upload preview', hi: 'अपलोड पूर्वावलोकन', pa: 'ਅੱਪਲੋਡ ਝਲਕ', ta: 'பதிவேற்ற முன்னோட்டம்' },
    image_analyzer_upload_instruction: { en: 'Drop an image here or click to upload', hi: 'यहां एक छवि छोड़ें या अपलोड करने के लिए क्लिक करें', pa: 'ਇੱਥੇ ਇੱਕ ਚਿੱਤਰ ਸੁੱਟੋ ਜਾਂ ਅੱਪਲੋਡ ਕਰਨ ਲਈ ਕਲਿੱਕ ਕਰੋ', ta: 'ஒரு படத்தை இங்கே விடுங்கள் அல்லது பதிவேற்ற கிளிக் செய்யவும்' },
    image_analyzer_prompt_placeholder: { en: 'Enter your analysis prompt here...', hi: 'यहां अपना विश्लेषण प्रॉम्प्ट दर्ज करें...', pa: 'ਇੱਥੇ ਆਪਣਾ ਵਿਸ਼ਲੇਸ਼ਣ ਪ੍ਰੋਂਪਟ ਦਾਖਲ ਕਰੋ...', ta: 'உங்கள் பகுப்பாய்வு வரியில் இங்கே உள்ளிடவும்...' },
    analyze_image_button: { en: 'Analyze Image', hi: 'छवि का विश्लेषण करें', pa: 'ਚਿੱਤਰ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ', ta: 'படத்தை பகுப்பாய்வு செய்' },
    analyzing: { en: 'Analyzing...', hi: 'विश्लेषण हो रहा है...', pa: 'ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...', ta: 'பகுப்பாய்வு செய்யப்படுகிறது...' },
    analysis_result_title: { en: 'Analysis Result', hi: 'विश्लेषण परिणाम', pa: 'ਵਿਸ਼ਲੇਸ਼ਣ ਨਤੀਜਾ', ta: 'பகுப்பாய்வு முடிவு' },
    results_placeholder: { en: 'Analysis results will appear here.', hi: 'विश्लेषण के परिणाम यहां दिखाई देंगे।', pa: 'ਵਿਸ਼ਲੇਸ਼ਣ ਦੇ ਨਤੀਜੇ ਇੱਥੇ ਦਿਖਾਈ ਦੇਣਗੇ।', ta: 'பகுப்பாய்வு முடிவுகள் இங்கே தோன்றும்.' },

    // Fix: Add missing translations for VideoAnalyzer
    video_analyzer_title: { en: 'Video Analyzer', hi: 'वीडियो विश्लेषक', pa: 'ਵੀਡੀਓ ਵਿਸ਼ਲੇਸ਼ਕ', ta: 'காணொளி பகுப்பாய்வி' },
    video_analyzer_default_prompt: { en: 'Analyze this video of my farm. Identify any potential issues with crops, irrigation, or overall health. Provide recommendations.', hi: 'मेरे खेत के इस वीडियो का विश्लेषण करें। फसलों, सिंचाई, या समग्र स्वास्थ्य के साथ किसी भी संभावित समस्या को पहचानें। सिफारिशें प्रदान करें।', pa: 'ਮੇਰੇ ਖੇਤ ਦੇ ਇਸ ਵੀਡੀਓ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ। ਫਸਲਾਂ, ਸਿੰਚਾਈ, ਜਾਂ ਸਮੁੱਚੀ ਸਿਹਤ ਨਾਲ ਕਿਸੇ ਵੀ ਸੰਭਾਵੀ ਮੁੱਦਿਆਂ ਦੀ ਪਛਾਣ ਕਰੋ। ਸਿਫ਼ਾਰਸ਼ਾਂ ਪ੍ਰਦਾਨ ਕਰੋ।', ta: 'எனது பண்ணையின் இந்த காணொளியை பகுப்பாய்வு செய்யுங்கள். பயிர்கள், நீர்ப்பாசனம் அல்லது ஒட்டுமொத்த ஆரோக்கியத்தில் உள்ள ஏதேனும் சிக்கல்களைக் கண்டறியவும். பரிந்துரைகளை வழங்கவும்.' },
    video_analyzer_upload_instruction: { en: 'Drop a video here or click to upload', hi: 'यहां एक वीडियो छोड़ें या अपलोड करने के लिए क्लिक करें', pa: 'ਇੱਥੇ ਇੱਕ ਵੀਡੀਓ ਸੁੱਟੋ ਜਾਂ ਅੱਪਲੋਡ ਕਰਨ ਲਈ ਕਲਿੱਕ ਕਰੋ', ta: 'ஒரு காணொளியை இங்கே விடுங்கள் அல்லது பதிவேற்ற கிளிக் செய்யவும்' },
    video_analyzer_prompt_placeholder: { en: 'Enter your analysis prompt here...', hi: 'यहां अपना विश्लेषण प्रॉम्प्ट दर्ज करें...', pa: 'ਇੱਥੇ ਆਪਣਾ ਵਿਸ਼ਲੇਸ਼ਣ ਪ੍ਰੋਂਪਟ ਦਾਖਲ ਕਰੋ...', ta: 'உங்கள் பகுப்பாய்வு வரியில் இங்கே உள்ளிடவும்...' },
    analyze_video_button: { en: 'Analyze Video', hi: 'वीडियो का विश्लेषण करें', pa: 'ਵੀਡੀਓ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ', ta: 'காணொளியை பகுப்பாய்வு செய்' },
    preparing_video: { en: 'Preparing video...', hi: 'वीडियो तैयार हो रहा है...', pa: 'ਵੀਡੀਓ ਤਿਆਰ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...', ta: 'காணொளி தயாராகிறது...' },
    analyzing_frames: { en: 'Analyzing {{count}} frames...', hi: '{{count}} फ्रेम का विश्लेषण हो रहा है...', pa: '{{count}} ਫਰੇਮਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...', ta: '{{count}} பிரேம்களை பகுப்பாய்வு செய்கிறது...' },
    
    // Fix: Add missing translations for FarmPlanner
    planner_title: { en: 'Farm Planner', hi: 'फार्म योजनाकार', pa: 'ਫਾਰਮ ਯੋਜਨਾਕਾਰ', ta: 'பண்ணை திட்டமிடுபவர்' },
    farm_profile_title: { en: 'Your Farm Profile', hi: 'आपका फार्म प्रोफाइल', pa: 'ਤੁਹਾਡਾ ਫਾਰਮ ਪ੍ਰੋਫਾਈਲ', ta: 'உங்கள் பண்ணை சுயவிவரம்' },
    location_placeholder: { en: 'e.g., Ludhiana, Punjab', hi: 'जैसे, लुधियाना, पंजाब', pa: 'ਜਿਵੇਂ, ਲੁਧਿਆਣਾ, ਪੰਜਾਬ', ta: 'எ.கா., லூதியானா, பஞ்சாப்' },
    farmSize_placeholder: { en: 'e.g., 5', hi: 'जैसे, 5', pa: 'ਜਿਵੇਂ, 5', ta: 'எ.கா., 5' },
    soilType_placeholder: { en: 'e.g., Loamy, Clay', hi: 'जैसे, दोमट, चिकनी', pa: 'ਜਿਵੇਂ, ਲੋਮੀ, ਚਿਕਨੀ', ta: 'எ.கா., வண்டல், களிமண்' },
    waterSource_placeholder: { en: 'e.g., Canal, Tubewell', hi: 'जैसे, नहर, ट्यूबवेल', pa: 'ਜਿਵੇਂ, ਨਹਿਰ, ਟਿਊਬਵੈੱਲ', ta: 'எ.கா., கால்வாய், ஆழ்துளை கிணறு' },
    currentCrops_placeholder: { en: 'e.g., Wheat, Rice', hi: 'जैसे, गेहूं, चावल', pa: 'ਜਿਵੇਂ, ਕਣਕ, ਚਾਵਲ', ta: 'எ.கா., கோதுமை, அரிசி' },
    goals_placeholder: { en: 'e.g., Increase yield by 15%, switch to organic farming', hi: 'जैसे, उपज 15% बढ़ाना, जैविक खेती में बदलना', pa: 'ਜਿਵੇਂ, ਝਾੜ 15% ਵਧਾਉਣਾ, ਜੈਵਿਕ ਖੇਤੀ ਵੱਲ ਸਵਿਚ ਕਰਨਾ', ta: 'எ.கா., விளைச்சலை 15% அதிகரித்தல், இயற்கை விவசாயத்திற்கு மாறுதல்' },
    generate_plan_button: { en: 'Generate My Plan', hi: 'मेरी योजना बनाएं', pa: 'ਮੇਰੀ ਯੋਜਨਾ ਬਣਾਓ', ta: 'எனது திட்டத்தை உருவாக்கு' },
    generating: { en: 'Generating...', hi: 'उत्पन्न हो रहा है...', pa: 'ਤਿਆਰ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...', ta: 'உருவாக்குகிறது...' },
    generated_plan_title: { en: 'Your Custom Farm Plan', hi: 'आपकी कस्टम फार्म योजना', pa: 'ਤੁਹਾਡੀ ਕਸਟਮ ਫਾਰਮ ਯੋਜਨਾ', ta: 'உங்கள் தனிப்பயன் பண்ணை திட்டம்' },
    plan_placeholder: { en: 'Your generated plan will appear here.', hi: 'आपकी उत्पन्न योजना यहां दिखाई देगी।', pa: 'ਤੁਹਾਡੀ ਤਿਆਰ ਕੀਤੀ ਯੋਜਨਾ ਇੱਥੇ ਦਿਖਾਈ ਦੇਵੇਗੀ।', ta: 'நீங்கள் உருவாக்கிய திட்டம் இங்கே தோன்றும்.' },

    // Errors
    error_generic: { en: 'Sorry, I encountered an error. Please try again.', hi: 'क्षमा करें, मुझे एक त्रुटि का सामना करना पड़ा। कृपया पुनः प्रयास करें।', pa: 'ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਇੱਕ ਗਲਤੀ ਆਈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।', ta: 'மன்னிக்கவும், ஒரு பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.' },
    error_tts: { en: 'Could not play audio.', hi: 'ऑडियो नहीं चला सका।', pa: 'ਆਡੀਓ ਨਹੀਂ ਚਲਾ ਸਕਿਆ।', ta: 'ஆடியோவை இயக்க முடியவில்லை.' },
    error_microphone: { en: 'Microphone access is required.', hi: 'माइक्रोफोन का उपयोग आवश्यक है।', pa: 'ਮਾਈਕ੍ਰੋਫੋਨ ਪਹੁੰਚ ਦੀ ਲੋੜ ਹੈ।', ta: 'மைக்ரோஃபோன் அணுகல் தேவை.' },
    // Fix: Add missing error translations
    error_image_analysis: { en: 'Sorry, I couldn\'t analyze the image. Please try another one.', hi: 'क्षमा करें, मैं छवि का विश्लेषण नहीं कर सका। कृपया कोई दूसरा प्रयास करें।', pa: 'ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਚਿੱਤਰ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਨਹੀਂ ਕਰ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਕੋਈ ਹੋਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ।', ta: 'மன்னிக்கவும், என்னால் படத்தை பகுப்பாய்வு செய்ய முடியவில்லை. தயவுசெய்து மற்றொன்றை முயற்சிக்கவும்.' },
    error_video_analysis: { en: 'Sorry, I couldn\'t analyze the video. Please try another one.', hi: 'क्षमा करें, मैं वीडियो का विश्लेषण नहीं कर सका। कृपया कोई दूसरा प्रयास करें।', pa: 'ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਵੀਡੀਓ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਨਹੀਂ ਕਰ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਕੋਈ ਹੋਰ ਕੋਸ਼ਿਸ਼ ਕਰੋ।', ta: 'மன்னிக்கவும், என்னால் காணொளியை பகுப்பாய்வு செய்ய முடியவில்லை. தயவுசெய்து மற்றொன்றை முயற்சிக்கவும்.' },
    error_frame_extraction: { en: 'Could not extract frames from the video. The file might be corrupted.', hi: 'वीडियो से फ्रेम नहीं निकाल सका। फ़ाइल दूषित हो सकती है।', pa: 'ਵੀਡੀਓ ਤੋਂ ਫਰੇਮ ਨਹੀਂ ਕੱਢ ਸਕਿਆ। ਫਾਈਲ ਖਰਾਬ ਹੋ ਸਕਦੀ ਹੈ।', ta: 'காணொளியிலிருந்து பிரேம்களைப் பிரித்தெடுக்க முடியவில்லை. கோப்பு சிதைந்திருக்கலாம்.' },
    error_plan_generation: { en: 'Sorry, I was unable to generate the farm plan at this time. Please try again later.', hi: 'क्षमा करें, मैं इस समय कृषि योजना बनाने में असमर्थ था। कृपया बाद में पुन: प्रयास करें।', pa: 'ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਇਸ ਸਮੇਂ ਫਾਰਮ ਯੋਜਨਾ ਤਿਆਰ ਕਰਨ ਵਿੱਚ ਅਸਮਰੱਥ ਸੀ। ਕਿਰਪਾ ਕਰਕੇ ਬਾਅਦ ਵਿੱਚ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।', ta: 'மன்னிக்கவும், இந்த நேரத்தில் பண்ணைத் திட்டத்தை உருவாக்க முடியவில்லை. தயவுசெய்து பின்னர் மீண்டும் முயற்சிக்கவும்.' },
};

type Translations = typeof a;
export type TranslationKey = keyof Translations;

const transformed: Record<Language, Record<TranslationKey, string>> = {
    en: {} as Record<TranslationKey, string>,
    hi: {} as Record<TranslationKey, string>,
    pa: {} as Record<TranslationKey, string>,
    ta: {} as Record<TranslationKey, string>,
};

for (const key in a) {
    const k = key as TranslationKey;
    for (const lang in a[k]) {
        const l = lang as Language;
        transformed[l][k] = a[k][l];
    }
}

export const translations = transformed;

export const getLanguageName = (code: Language): string => {
    switch (code) {
        case 'en': return 'English';
        case 'hi': return 'Hindi';
        case 'pa': return 'Punjabi';
        case 'ta': return 'Tamil';
        default: return 'English';
    }
}