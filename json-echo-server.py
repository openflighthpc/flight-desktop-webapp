#!/usr/bin/env python3

from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
import json

class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        data = {k: v[0] for k, v in parse_qs(parsed_path.query).items()}
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        # self.wfile.write(json.dumps({
        #     'method': self.command,
        #     'path': self.path,
        #     'real_path': parsed_path.query,
        #     'query': parsed_path.query,
        #     'request_version': self.request_version,
        #     'protocol_version': self.protocol_version,
        #     'body': data
        # }).encode())
        self.wfile.write(json.dumps(data).encode())
        return

    def do_POST(self):
        print(self.headers['content-length'])
        content_len = int(self.headers['content-length'])
        post_body = self.rfile.read(content_len)
        data = json.loads(post_body.decode('utf-8'))

        parsed_path = urlparse(self.path)
        self.send_response(200)
        self.end_headers()
        self.wfile.write(json.dumps({
            'method': self.command,
            'path': self.path,
            'real_path': parsed_path.query,
            'query': parsed_path.query,
            'request_version': self.request_version,
            'protocol_version': self.protocol_version,
            'body': data
        }).encode())
        return

if __name__ == '__main__':
    server = HTTPServer(('localhost', 8000), RequestHandler)
    print('Starting server at http://localhost:8000')
    server.serve_forever()
