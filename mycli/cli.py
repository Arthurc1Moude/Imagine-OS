import argparse
import sys
from typing import List

from . import __version__


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="mycli",
        description="A simple CLI with greet and calc subcommands",
    )

    parser.add_argument(
        "-v",
        "--version",
        action="version",
        version=f"mycli {__version__}",
        help="Show version and exit",
    )

    subparsers = parser.add_subparsers(dest="command")

    # greet subcommand
    greet_parser = subparsers.add_parser("greet", help="Print a greeting message")
    greet_parser.add_argument(
        "-n",
        "--name",
        default="World",
        help="Name to greet (default: World)",
    )
    greet_parser.add_argument(
        "-t",
        "--times",
        type=_positive_int,
        default=1,
        help="Number of times to repeat the greeting (default: 1)",
    )
    greet_parser.set_defaults(func=_handle_greet)

    # calc subcommand
    calc_parser = subparsers.add_parser("calc", help="Perform simple calculations")
    calc_parser.add_argument(
        "operation",
        choices=["add", "sub", "mul", "div"],
        help="Operation to perform",
    )
    calc_parser.add_argument(
        "operands",
        nargs="+",
        type=float,
        help="One or more numbers to operate on",
    )
    calc_parser.set_defaults(func=_handle_calc)

    return parser


def _positive_int(value: str) -> int:
    try:
        parsed = int(value)
    except ValueError as error:
        raise argparse.ArgumentTypeError("times must be an integer") from error
    if parsed <= 0:
        raise argparse.ArgumentTypeError("times must be a positive integer")
    return parsed


def _handle_greet(args: argparse.Namespace) -> int:
    for _ in range(args.times):
        print(f"Hello, {args.name}!")
    return 0


def _handle_calc(args: argparse.Namespace) -> int:
    operation = args.operation
    numbers: List[float] = args.operands

    if operation == "add":
        result = 0.0
        for number in numbers:
            result += number
    elif operation == "sub":
        result = numbers[0]
        for number in numbers[1:]:
            result -= number
    elif operation == "mul":
        result = 1.0
        for number in numbers:
            result *= number
    elif operation == "div":
        result = numbers[0]
        for number in numbers[1:]:
            if number == 0.0:
                print("Error: division by zero", file=sys.stderr)
                return 1
            result /= number
    else:
        print(f"Unknown operation: {operation}", file=sys.stderr)
        return 2

    print(result)
    return 0


def main(argv: List[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    if not hasattr(args, "func"):
        parser.print_help()
        return 0
    status = args.func(args)
    return int(status)


if __name__ == "__main__":
    raise SystemExit(main())

