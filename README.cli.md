# hello-calc-cli

A simple Python command-line application with two subcommands:

- greet: Print a greeting message
- calc: Perform simple calculations (add, sub, mul, div)

## Quick start

Run directly without install:

```bash
python -m mycli greet --name Alice
python -m mycli calc add 1 2 3.5
```

Install in editable mode (optional):

```bash
python -m pip install -e .
```

Then run using installed entry point:

```bash
mycli greet --name Bob
mycli calc mul 2 3 4
```

## Usage

```bash
python -m mycli --help | cat
python -m mycli greet --help | cat
python -m mycli calc --help | cat
```

## License

MIT