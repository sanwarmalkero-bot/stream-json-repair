# stream-json-repair
A zero-dependency JavaScript utility that repairs broken or incomplete JSON data from live text streams. By tracking brackets and unclosed structural objects locally, it instantly closes dangling syntax, strings, or trailing commas caused by sudden connection drops. This prevents malformed data loops from crashing critical backend operations.
