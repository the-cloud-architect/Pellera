from secrets import token_urlsafe


def handler(context, inputs):
    return token_urlsafe(24)
