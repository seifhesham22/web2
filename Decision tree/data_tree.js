function getData(number) {
    let data = [];
    data[0] = [
        ["outlook",     "temperature",  "humidity",     "windy",    "play"  ],
        ["overcast",    "hot",          "high",         "false",    "yes"   ],
        ["overcast",    "cool",         "normal",       "true",     "yes"   ],
        ["overcast",    "mild",         "high",         "true",     "yes"   ],
        ["overcast",    "hot",          "normal",       "false",    "yes"   ],
        ["rainy",       "mild",         "high",         "false",    "yes"   ],
        ["rainy",       "cool",         "normal",       "false",    "yes"   ],
        ["rainy",       "cool",         "normal",       "true",     "no"    ],
        ["rainy",       "mild",         "normal",       "false",    "yes"   ],
        ["rainy",       "mild",         "high",         "true",     "no"    ],
        ["sunny",       "hot",          "high",         "false",    "no"    ],
        ["sunny",       "hot",          "high",         "true",     "no"    ],
        ["sunny",       "mild",         "high",         "false",    "no"    ],
        ["sunny",       "cool",         "normal",       "false",    "yes"   ],
        ["sunny",       "mild",         "normal",       "true",     "yes"   ]
    ];
    
 
    data[1] = [
        ["outlook",  "temperature", "humidity",  "windy", "play"  ],
        ["overcast", "hot",         "high",      "false", "no"    ],
        ["overcast", "cool",        "normal",    "true",  "yes"   ],
        ["overcast", "mild",        "high",      "true",  "no"    ],
        ["overcast", "hot",         "normal",    "false", "yes"   ],
        ["rainy",    "mild",        "high",      "false", "no"    ],
        ["rainy",    "cool",        "normal",    "false", "yes"   ],
        ["rainy",    "cool",        "normal",    "true",  "no"    ],
        ["rainy",    "mild",        "normal",    "false", "yes"   ],
        ["rainy",    "mild",        "high",      "true",  "no"    ],
        ["sunny",    "hot",         "high",      "false", "no"    ],
        ["sunny",    "hot",         "high",      "true",  "no"    ],
        ["sunny",    "mild",        "high",      "false", "no"    ],
        ["sunny",    "cool",        "normal",    "false", "yes"   ],
        ["sunny",    "mild",        "normal",    "true",  "yes"   ]
    ];
    data[2] = [
        ["usd",     "lamphat",  "nctt",     "slkt",     "play " ],
        ["TANG",    "GIAM",     "THAP",     "TB",       "THAP " ],
        ["TANG",    "TANG",     "THAP",     "TB",       "CAO "  ],
        ["TANG",    "ON DINH",  "CAO",      "TB",       "CAO "  ],
        ["TANG",    "TANG",     "THAP",     "THAP",     "CAO "  ],
        ["TANG",    "GIAM",     "TB",       "THAP",     "CAO "  ],
        ["TANG",    "GIAM",     "CAO",      "THAP",     "THAP " ],
        ["TB",      "ON DINH",  "TB",       "CAO",      "THAP " ],
        ["TB",      "GIAM",     "THAP",     "CAO",      "THAP " ],
        ["TB",      "TANG",     "TB",       "THAP",     "THAP " ],
        ["TB",      "ON DINH",  "CAO",      "TB",       "CAO "  ],
        ["TB",      "GIAM",     "CAO",      "CAO",      "CAO "  ],
        ["GIAM",    "ON DINH",  "CAO",      "THAP",     "THAP " ],
        ["GIAM",    "GIAM",     "CAO",      "CAO",      "CAO "  ],
        ["GIAM",    "TANG",     "CAO",      "TB",       "THAP " ],
        ["GIAM",    "TANG",     "THAP",     "THAP",     "THAP " ],
        ["GIAM",    "ON DINH",  "CAO",      "TB",       "CAO "  ]
    ];
    data[3] = [
        ["outlook",     "temperature",  "humidity",     "windy",    "play"      ],
        ["sunny",       "hot",          "high",         "false",    "no"        ],
        ["sunny",       "hot",          "high",         "true",     "no"        ],
        ["overcast",    "hot",          "high",         "false",    "yes"       ],
        ["rainy",       "mild",         "high",         "false",    "yes"       ],
        ["rainy",       "cool",         "normal",       "false",    "yes"       ],
        ["rainy",       "cool",         "normal",       "true",     "no"        ],
        ["overcast",    "cool",         "normal",       "true",     "yes"       ],
        ["sunny",       "mild",         "high",         "false",    "no"        ],
        ["sunny",       "cool",         "normal",       "false",    "yes"       ],
        ["rainy",       "mild",         "normal",       "false",    "yes"       ],
        ["sunny",       "mild",         "normal",       "true",     "yes"       ],
        ["overcast",    "mild",         "high",         "true",     "yes"       ],
        ["overcast",    "hot",          "normal",       "false",    "yes"       ],
        ["rainy",       "mild",         "high",         "true",     "no"        ],
        ["overcast",    "mild",         "normal",       "true",     "yes"       ]
    ];
    
   

    return data[number]
}