// eslint-disable-next-line react/prop-types
import React from 'react';
function ContextPopupCard({ JsonResult , idx}) {
    
    const totalWordPhonemesArray = JsonResult.word_phonemes;

    var data;

    totalWordPhonemesArray.forEach((obj, i) => {

        const key = Object.keys(obj)[0];
        
        // console.log("key : ", key);
        if (Number(key) === Number(idx)) {
            console.log("ContextPopupCard :obj: ", totalWordPhonemesArray[i]);
            data =  Object.values(totalWordPhonemesArray[i]);
        }
    });


    // Extract the key and the array of phoneme objects
    const key = Object.keys(data)[0];
    const phonemeData = data[key];

    return (
        <div className='context_popup_card p-2 border border-gray-300 shadow-sm'>
            <div className='flex flex-wrap items-center'>
                {phonemeData.map((phonemeObj, index) => {
                    const phoneme = Object.keys(phonemeObj)[0];
                    const value = phonemeObj[phoneme];
                    return (
                        <div key={index} className='flex flex-col items-center px-1 rounded-lg flex-wrap'>
                            <div className='font-bold text-xs'>{phoneme}</div>
                            <div className='text-gray-600 text-xs'>{value}</div>
                        </div>
                    );   
                })}
            </div>
        </div>
    );
}

export default ContextPopupCard;
