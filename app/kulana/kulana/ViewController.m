//
//  ViewController.m
//  kulana
//
//  Created by Jacob Jenne on 4/12/18.
//  Copyright © 2018 Jacob Jenne. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    
    NSLog(@"1");
    NSURL *url = [NSURL URLWithString:@"https://kulana.social"];
    [self.webview loadRequest:[NSURLRequest requestWithURL:url]];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
