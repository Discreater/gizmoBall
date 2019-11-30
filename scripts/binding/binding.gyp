{
  "targets": [
    {
      "target_name": "native",
      "sources": [
        "binding.cpp"
      ],
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"],
      "defines": ["NAPI_CPP_EXCEPTIONS"]
    }
  ]
}